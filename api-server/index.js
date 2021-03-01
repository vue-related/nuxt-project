/**
 * 后端服务的总入口，功能介绍见README.md。
 *
 * TODO:
 * -1. yaml配置梳理(yaml将密钥抽成结构体).
 * -2. 整理：linux服务器.
 * 3. 登陆：鉴权，判断登陆状态.
 * 4. 文件处理：上传、解析、校验(导入excel中repo url完整性校验，安全函数等为空等异常校验)、合并、入库、生成json.
 * 5. isource API: push json文件，触发MR.
 * 6. 接收流水线检查结果.
 * 7. 部署: pm2, nginx, redis, mongodb, MQ, nodejs.
 * 8. log4js: event index事件索引，便于日志搜索.
 * 9. 404、500错误处理.
 * 10. deploy guide.
 * 11. performance test.
 * 其他：
 * 12. 整理starlab-public-service: cookie/session/log/redis/file upload(body)/excel/mongodb/sso.
 * 13. vue:export/import; nodejs:export/require/module.exports; ts:import/export/export default;
 */

const path = require('path')
const { Nuxt, Builder } = require('nuxt')

// koa2 related modules
const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body')
// const bodyParser = require('koa-bodyparser')
const statics = require('koa-static')
const app = new Koa()
const router = new Router()

// other modules
const consola = require('consola')
// const isAbsoluteUrl = require('is-absolute-url')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'

// my private modules
const apiRouter = require('./routers') // API接口路由
const { session, sessConfig } = require('./lib/session')
const logger = require('./lib/logger')
const runLogger = logger.getLogger('run_log')
const { getGlobalConfig } = require('./lib/yaml/configLoader')
const gConfig = getGlobalConfig()

// logger global middlewares
// logger.app.use(
//   //maybe need to use 'log4koa'.
//   logger.connectLogger(logger.getLogger('run_log'), {
//     format: '[:remote-addr :method :url :status :response-timems][:referrer HTTP/:http-version :user-agent]' //自定义输出格式
//   })
// )

app.keys = [gConfig.appKey || 'secret']
app.use(statics(path.join(__dirname, '../static')))
// app.use(bodyParser())
app.use(session(sessConfig, app))
app.use(
  koaBody({
    json: true,
    text: true,
    multipart: true, // 解析多部分主体，默认false
    // encoding: 'gzip',
    formidable: {
      uploadDir: path.join(__dirname, '../', gConfig.uploadFilePath.temp), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      hash: 'sha1', // md5 or sha1
      maxFileSize: 50 * 1024 * 1024, // 上传文件大小限制，默认2M
      /**
       * 文件上传前的设置
       * @param {*} name: 上传的原始文件名称
       * @param {*} file: 文件对象，包含属性:
       * hash: null
       * lastModifiedDate: null
       * name: "123.xlsx"
       * path: "D:\upload\upload_8980910f4ee0357c462315a0e0c4b1f7.xlsx"
       * size: 0
       * type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
       */
      onFileBegin: (name, file) => {
        console.log(`name: ${name}`, file)
      }
    }
  })
)

app.use(async (ctx, next) => {
  // TODO: deal delay statistics.
  const startTime = new Date().getTime()

  // TODO: request log: who when did something.
  runLogger.info(`${ctx.request.method} ${ctx.request.url}`)

  // global exception catcher.
  try {
    await next()
    // successfully finished, do statistics.
    // runLogger.debug(`[indexjs]task successed, total time: ${new Date().getTime() - startTime}ms`)
  } catch (err) {
    ctx.status = err.status || err.statusCode || 500
    ctx.body = {
      message: err.message // 把错误信息返回到页面
    }
    // 通过app来派发错误，然后通过监听app上的error事件对这些错误做进一步的统一处理和集中管理
    ctx.app.emit('error', err, ctx)

    // failed, record main items.
    runLogger.error(`[indexjs]task failed, total time: ${new Date().getTime() - startTime}ms`)
  }
})

// portal router.
// router.get('/', async ctx => {
//   ctx.response.type = 'html'
//   ctx.response.body = await 'this is the home page.'
// })

// rpc routers without login required.
router.get('/statistics', async ctx => {
  // ctx.request.query.xxx // 获取url参数
  ctx.session.count = ctx.session.count || 0
  ctx.session.count++
  ctx.body = await `Statistics, you visited this page for : ${ctx.session.count} times`
  runLogger.debug(`page request result: ${JSON.stringify(ctx.response.body)}`)
})

router.get('/404', async (ctx, next) => {
  console.log('server:' + 'in 404')
  ctx.response.body = await '<h1>404 Not Found</h1>'
})

// RESTFul API接口路由: /api/...
router.use(apiRouter.routes()).use(apiRouter.allowedMethods())
app.use(router.routes()).use(router.allowedMethods())

// TODO: 对加载超时或404等的处理
app.on('error', function (err, ctx) {
  /* 错误的集中处理:
   * log 出来
   * 写入日志
   * 写入数据库
   *  ...
   */
  runLogger.error(`logging error ${err.message}`)
})

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)
  const { host = process.env.HOST || gConfig.host, port = process.env.PORT || gConfig.port } = nuxt.options.server

  await nuxt.ready()

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(ctx => {
    // console.log('server file:' + ctx.request.url)
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  // 这里不要配置host，会限制请求url，无法同时支持ip和域名两种请求方式
  app.listen(port, function () {
    runLogger.info(`Server listening on http://${host}:${port}`)
  })

  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
