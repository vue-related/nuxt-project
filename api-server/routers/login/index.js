const Router = require('koa-router')
const _ = require('lodash')
const ldap = require('../../lib/auth/ldap')
const { getGlobalConfig } = require('../../lib/yaml/configLoader')
const gConfig = getGlobalConfig()

const router = new Router({
  prefix: '/user'
})

/**
 * ldap return data example:
 * {
  dn: 'CN=bogking,OU=OverseaCorpUsers,DC=china,DC=xxx,DC=com',
  controls: [],
  title: 'bogking,xxx,CCN',
  givenName: 'bogking',
  name: 'bogking',
  sAMAccountName: 'bogking',
  sn: 'bogking',
  mail: 'bogking@xxx.com',
  mobile: '+861xx',
  msExchUserCulture: 'zh-CN'
 * }
 *
 */
router.post('/login', async ctx => {
  let isParamVaild = true
  const result = { code: 20000, token: gConfig.cookie.key, message: '' }

  const username = ctx.request.body && ctx.request.body.username
  const password = ctx.request.body && ctx.request.body.password

  // check params.
  if (undefined === username || _.trim(username) === '') {
    isParamVaild = false
    result.code = 20001
    result.message = 'no username found.'
  }
  if (undefined === password || _.trim(password) === '') {
    isParamVaild = false
    result.code = 20002
    result.message = 'no password found.'
  }
  if (!isParamVaild) {
    ctx.body = await result
    return
  }

  // login by ldap auth.
  try {
    const data = await ldap(username, password)

    if (undefined !== data.mail) {
      // debug_login('[login][2]ldap ldap successed')
      // cookie configuration
      const _config = { signed: true, maxAge: gConfig.cookie.maxAge.short }
      // if (void 0 !== req.body.keepAlive && 'true' === req.body.keepAlive) {
      //   _config.maxAge = globalConfig.cookie.maxAge.long
      // } else _config.maxAge = globalConfig.cookie.maxAge.short

      // set cookies
      ctx.cookies.set('username', data.sAMAccountName, _config)
      ctx.cookies.set('email', data.mail, _config)
      ctx.cookies.set('mobile', data.mobile, _config)
      ctx.cookies.set('department', Buffer.from(data.title).toString('base64'), _config)

      // cookie & session
      ctx.session.isLogin = true
      ctx.session.givenName = data.givenName
      ctx.session.fullname = data.name
      ctx.session.accountName = data.sAMAccountName.toLowerCase()
      ctx.session.userNo = data.sn
      ctx.session.email = data.mail
      ctx.session.mobile = data.mobile
      ctx.session.department = data.title
      ctx.session.motherTongue = data.msExchUserCulture

      // use "/" when req.body.url is "" or absolute url.
      // debug_login('[login][3]session info: ' + ctx.session.id + ': ' + JSON.stringify(ctx.session))

      result.code = 20000
      result.token = data.sn // TODO:临时把工号作为token，切换sso后，需移除
      // result.username = data.givenName
      result.maxAge = gConfig.cookie.maxAge.short
      result.expires = result.maxAge / (24 * 60 * 60 * 1000) // 转化成天数
      ctx.body = result
    } else {
      result.code = 20004
      result.message = 'login succeed with ldap but failed with parse.'
      ctx.body = result
      // debug_login('[login][2]ldap auth failed')
    }
  } catch (error) {
    result.code = 20003
    result.message = 'Login failed. Enter the correct username or password, please.' // JSON.stringify(error)
    ctx.body = result
  }
})

router.get('/info', async ctx => {
  ctx.body = await {
    list: ['some text']
  }
})

router.post('/logout', async ctx => {
  ctx.body = await {
    list: ['some text']
  }
})

module.exports = router
