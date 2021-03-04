const os = require('os')
const path = require('path')
const Router = require('koa-router')
const { findIndex } = require('lodash')
const isThere = require('is-there')
const excelToJson = require('convert-excel-to-json')
const fileType = require('file-type')
const jsonfile = require('jsonfile')
const del = require('del')
const fse = require('fs-extra')
const shell = require('shelljs')
const moment = require('moment')
const superagent = require('superagent')
const BbPromise = require('bluebird')
const { getGlobalConfig, getPiplineConfig } = require('../../lib/yaml/configLoader')

const guidePermisonConfig = getPiplineConfig()
const gConfig = getGlobalConfig()
const separator = os.platform() === 'win32' ? '\\' : '/' // or 'linux'

const router = new Router({
  prefix: '/security-guard'
})
// 当前模块权限与配置
router.get('/permission', async (ctx, next) => {
  let hasModifyRight = false
  let products = []
  const allProducts = []
  const userId = ctx.session.accountName

  if (findIndex(guidePermisonConfig.admins, ['userId', userId]) !== -1) {
    hasModifyRight = true
    products = guidePermisonConfig.products
  } else {
    const ownerIdx = findIndex(guidePermisonConfig.owners, ['userId', userId])
    if (ownerIdx !== -1) {
      hasModifyRight = true
      const _products = guidePermisonConfig.owners[ownerIdx].products

      // 根据配置文件中人员管理的工具的key，在prodcts中找对应工具的信息
      _products.forEach(val => {
        const _idx = findIndex(guidePermisonConfig.products, ['key', val])
        if (_idx !== -1) {
          products.push(guidePermisonConfig.products[_idx])
        }
      })
    }
  }

  guidePermisonConfig.products.forEach(val => {
    allProducts.push({ text: val.name, value: val.key })
  })

  ctx.response.body = await {
    code: 20000,
    data: {
      hasModifyRight,
      products,
      allProducts
    },
    message: ''
  }
})

// 门禁规则表格对应的数据
router.get('/rules', async (ctx, next) => {
  const items = []

  // 遍历所有生成的json文件，汇总数据
  guidePermisonConfig.products.forEach((val, idx) => {
    const productKey = val.key
    const filePath = path.join(__dirname, '../../../', gConfig.uploadFilePath.business) + `${productKey}.json`
    if (!isThere(filePath)) return

    const rules = jsonfile.readFileSync(filePath)

    rules.Sheet1.forEach((val, idx) => {
      if (idx === 0) return

      items.push({
        id: val.H,
        productName: val.B,
        productKey,
        feature: val.C,
        module: val.D,
        repository: val.E,
        fileName: val.F,
        secFrameworkAPI: val.G,
        status: val.I,
        updateTime: moment(rules.postDate).fromNow(),
        reportTime: moment(rules.reportDate).fromNow(),
        author: rules.author,
        developer: rules.developer || '云龙平台'
      })
    }) // end of rules forEach.
  })

  ctx.response.body = await {
    code: 20000,
    data: {
      total: 1, // items.length,
      items
    },
    message: ''
  }
})

// 处理上传的门禁规则文件，先写入临时文件区
router.post('/rule-file', async (ctx, next) => {
  const filePath = ctx.request.files.file.path
  const _tmp = filePath.split(separator)
  const fileName = _tmp[_tmp.length - 1]
  console.log(ctx.request.files)

  ctx.response.body = await {
    code: 20000,
    data: {
      key: fileName
    },
    message: ''
  }
})

// 处理更新门禁规则表单，读取文件写json，归档到正式文件区，推送git repo
router.post('/rules', async (ctx, next) => {
  // 参数: "{"productName":"DP","keys":["upload_b8fa48414f9172abce67502bd1029243.txt"],"timestamp":null}"
  const productName = ctx.request.body.productName
  let department = ''
  let filePath = ''
  let message = ''

  try {
    // 表单中文件为空
    if (ctx.request.body.keys.length === 0) {
      ctx.response.body = await {
        code: 20100,
        data: {},
        message: '导入失败，尚未上传规则文件'
      }
      return
    }

    // 表单中的文件不存在
    filePath = path.join(__dirname, '../../../', gConfig.uploadFilePath.temp, ctx.request.body.keys[0])
    if (!isThere(filePath)) {
      console.log(`[security guard][error]upload file not exist: ${filePath}`)
      ctx.response.body = await {
        code: 20100,
        data: {},
        message: '导入失败，指定的规则文件不存在，请重新上传'
      }
      return
    }

    // 文件后缀的判断
    const type = await fileType.fromFile(filePath)
    if (type === undefined || type.ext !== 'xlsx') {
      console.log(`[security guard][error]upload file type is not xlsx, is: ${type === undefined ? 'text-based formats file type' : type.ext}`)
      ctx.response.body = await {
        code: 20100,
        data: {},
        message: '导入失败，上传的文件文件后缀不是xlsx，或者不是合法的Excel文件'
      }
      return
    }

    // 表单中指定的产品是否存在
    const prodIdx = findIndex(guidePermisonConfig.products, ['key', productName])
    if (prodIdx === -1) {
      console.log(`[security guard][error]product not exist: ${productName}`)
      ctx.response.body = await {
        code: 20100,
        data: {},
        message: '导入失败，指定的产品不存在'
      }
      return
    } else {
      department = guidePermisonConfig.products[prodIdx].department
    }

    // 用户是否有操作权限的判断
    let hasModifyRight = false
    if (findIndex(guidePermisonConfig.admins, ['userId', ctx.session.accountName]) !== -1) {
      hasModifyRight = true
    } else if (findIndex(guidePermisonConfig.owners, ['userId', ctx.session.accountName]) !== -1) {
      hasModifyRight = true
    }
    if (!hasModifyRight) {
      console.log(`[security guard][error]this user has no right: ${ctx.session.fullname}`)
      ctx.response.body = await {
        code: 20100,
        data: {},
        message: '导入失败，指定的产品不存在'
      }
      return
    }

    /**
     * 文件解析结果的处理:
     * such as: "{"Sheet1":[{
     * "A":"CoreALM ID",
     * "B":"Tool Name",
     * "C":"Security Feature",
     * "D":"Security Module",
     * "E":"code repository",
     * "F":"code file path",
     * "G":"code fileName",
     * "H":"Platform SecFrameworkAPI"}]}"
     * "I":"id",
     *
     */
    const result = excelToJson({
      sourceFile: filePath
      // header: {
      //   rows: 1 // 指定行数
      // },
      // sheets: ['sheet2'], // 指定sheet页
      // // 列的索引映射
      // columnToKey: {
      //   A: 'id',
      //   B: 'firstName'
      // }
    })

    // 生成新的json文件, excel文件归档
    const newJsonFilePath = path.join(__dirname, '../../../', gConfig.uploadFilePath.business) + `${productName}.json`
    const newExcelFilePath = path.join(__dirname, '../../../', gConfig.uploadFilePath.business) + `${productName}.xlsx`
    await del.sync([newJsonFilePath, newExcelFilePath], { force: true })

    fse.moveSync(filePath, newExcelFilePath, { overwrite: true })

    // 推送json到git仓库
    const newGitJsonFilePath = path.join(__dirname, '../../../', gConfig.uploadFilePath.business) + `${productName}_for_git.json`
    const gitJson = { product: productName, postDate: moment().format() }

    // 规则文件内容简单校验：Sheet1存在性，行数不足，列数不足问题，插入id列
    let isExcelOk = true
    if (result.Sheet1 === undefined || result.Sheet1.length <= 1) {
      isExcelOk = false
      message = '更新失败：Excel为空，或Sheet页名称不是"Sheet1"，请重新上传'
    } else {
      /**
       * 数据封装:
       * {
       *    "product": "CLLI",
       *  "https://isource-xa.huawei.com/OMstarPS_NFV/CLLI_GDE.git":[
       *  {
       *    "fileName": "NfviCollectionService.java",
       *    "apis": [{"id":"CLLI1","api":"USEncryptor.decrypt"},...]
       *  },...
       *  ]
       * }
       */
      result.Sheet1.forEach((val, idx) => {
        if (isExcelOk === false) return
        if (idx === 0) {
          result.Sheet1[idx].H = 'id' // 给excel原始对象增加索引
          result.Sheet1[idx].I = 'status' // 给excel原始对象增加状态
          return
        }

        if (val.G === undefined) {
          // 表格行的最后一列长度不够，执行拦截
          isExcelOk = false
          message = `更新失败：Excel的第${idx}行数据不完整，请重新上传`
          return
        }

        val.H = `${productName}_${idx}` // 给excel对象临时增加索引，不会反应到原始对象上
        result.Sheet1[idx].H = val.H // 给excel原始对象增加索引
        result.Sheet1[idx].I = 'noData' // 给excel原始对象增加规则状态

        if (gitJson[val.E] === undefined) gitJson[val.E] = []

        const _idx = findIndex(gitJson[val.E], ['fileName', val.F])
        if (_idx === -1) {
          gitJson[val.E].push({ fileName: val.F, apis: [{ id: val.H, api: val.G }] })
        } else {
          gitJson[val.E][_idx].apis.push({ id: val.H, api: val.G })
        }
      })
    }

    if (isExcelOk === false) {
      console.log(`[security guard][error]excel check failed: ${message}`)
      ctx.response.body = await {
        code: 20100,
        data: {},
        message
      }
      return
    }
    // json文件中增加修改人和修改时间
    result.postDate = moment().format()
    result.author = ctx.session.fullname

    jsonfile.writeFileSync(newJsonFilePath, result)
    jsonfile.writeFileSync(newGitJsonFilePath, gitJson)

    // 移动json文件，推送到远端git仓库，并通过接口触发MR
    let isGitCmdOk = true
    const targetGitPath = path.join(gConfig.uploadFilePath.businessRepos[department].localRepoPath)
    if (!shell.which('git')) {
      isGitCmdOk = false
      message = `环境缺少git命令，请先安装再重试`
    } else if (!isThere.directory(targetGitPath)) {
      isGitCmdOk = false
      message = `本地git仓库目录不存在`
    } else {
      fse.moveSync(newGitJsonFilePath, targetGitPath + `/${productName}/ApiList.json`, { overwrite: true })
      shell.cd(targetGitPath)

      // 需要提前配置好git仓库，比如ssh key，用户信息，upstream等
      if (shell.exec(gConfig.uploadFilePath.businessRepos[department].cmd).code !== 0) {
        isGitCmdOk = false
        message = `推送文件到git仓库失败`
      }

      // 提交MR
      try {
        await MR(gConfig.uploadFilePath.businessRepos[department])
      } catch (error) {
        isGitCmdOk = false
        message = `${error}`
      }
    }
    if (!isGitCmdOk) {
      ctx.response.body = await {
        code: 20100,
        data: {},
        message
      }
      return
    }

    ctx.response.body = await {
      code: 20000,
      data: {},
      message: ''
    }
  } catch (error) {
    // 异常情况:
    // 规则文件处理过程中出现异常:{"errno":-4058,"syscall":"open","code":"ENOENT","path":"D:\\coding\\isource\\starlab\\software-measurement-platform-web-portal\\upload\\security-guard\\DP\\.json"}
    ctx.response.body = await {
      code: 20100,
      data: {},
      message: `规则文件处理过程中出现异常:${JSON.stringify(error)}`
    }
  }
})

/**
 * 接收coreCD流水线上报的数据。
 * 数据需要入库，用于后续的统计分析，数据格式如下：
 * {
      code:200, //xxx
      token: "abc", //AES(private_key, timestemp)
      time: UTC,
      taskUrl: "",
      product: "",
      userId: "",
      message:"",
      result:[{
        id:"CLLI_1",
        status: "yyy",
      },...]
    }
 */
router.post('/guard-report', async (ctx, next) => {
  const params = ctx.request.body
  let message = ''
  console.log(params)

  if (params.code !== 200) {
    message = `流水线执行失败，流水线状态码:${params.code},原因:${params.message}`
    console.log(message)
    ctx.response.body = await { code: 20020, data: {}, message }
    return
  }

  const filePath = path.join(__dirname, '../../../', gConfig.uploadFilePath.business) + `${params.product}.json`
  if (!isThere(filePath)) {
    message = `指定的产品${params.product}不存在，请检查`
    console.log(message)
    ctx.response.body = await { code: 20020, data: {}, message }
    return
  }
  const rules = jsonfile.readFileSync(filePath)
  rules.reportDate = params.time
  rules.developer = params.userId
  rules.taskUrl = params.taskUrl

  let paramsIdx = 0
  rules.Sheet1.forEach((val, idx) => {
    // 规则更新后可能增减，排除场景：
    // 规则MR未合入，两侧比对条数会不一致的问题
    if (idx === 0 || paramsIdx >= params.result.length) return

    // 判断规则编号是否对应
    if (val.H !== params.result[paramsIdx].id) return
    rules.Sheet1[idx].I = params.result[paramsIdx].status
    paramsIdx++
  })
  jsonfile.writeFileSync(filePath, rules)

  ctx.response.body = await { code: 20000, data: {}, message: '' }
})

// 界面查询门禁运行统计
router.get('/guard-statistics', async (ctx, next) => {
  ctx.response.body = await { code: 20000, data: {}, message: '' }
})

function getRepoIdFromIsource(repoName) {
  return new BbPromise(function (resolve, reject) {
    superagent
      .get(`http://rnd-isource.huawei.com/api/v3/projects/${repoName}`)
      .set('PRIVATE-TOKEN', 'sc-uPqbWXyijjYDRxxJb')
      .end((err, res) => {
        // Calling the end function will send the request
        if (err || undefined === res) {
          console.log(err)
          reject(err)
        }
        resolve(res.body.id)
        return res.body.id
      })
  })
}

function MR(mrInfo) {
  return new BbPromise(function (resolve, reject) {
    getRepoIdFromIsource(mrInfo.repoName).then(d => {
      superagent
        .post(`http://www.github.com/api/v1/${mrInfo.repoName}/merge_requests`)
        .set('PRIVATE-TOKEN', mrInfo.privateToken)
        .set('Content-Type', 'application/json')
        .send({
          id: d,
          source_branch: mrInfo.srcBranch,
          target_branch: mrInfo.destBranch,
          target_project_id: d,
          assignee_id: mrInfo.committer,
          reviewers: mrInfo.reviewer,
          title: '更新配置文件',
          content: '更新配置文件'
        })
        .end((err, res) => {
          // Calling the end function will send the request
          if (err || undefined === res || !res.ok) {
            console.log(err)
            const message = `MR创建失败:${res.body.message}`
            reject(message)
            return message
          }
          resolve('MR提交成功')
        })
    })
  })
}

module.exports = router
