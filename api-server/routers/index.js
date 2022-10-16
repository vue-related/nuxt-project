/**
 * code码：
 * 20000: 正常
 * 以下为登陆阶段异常码：
 * 20001: 用户名为空
 * 20002: 密码为空
 * 20003: ldap登陆异常
 * 20004: ldap登陆成功，但数据解析异常
 * 20005:
 * 20006:
 * 20007:
 * 以下为使用过程中session/token超时异常状态码：
 * 20008: Illegal token
 * 20009: Other clients logged in
 * 20010: Token expired
 *
 * 下边序号是安全门禁的异常：
 * 20100: 安全门禁上传规则文件类的异常
 /
 
 /**
 * bluebird reject error:
 * 1. Warning: .then() only accepts functions
 * 回调要是函数。
 *
 * 2. Warning: a promise was rejected with a non-error: [object Object]
 * reject传入的对象不是一个new Error()对象，没有 stack trace信息，bluebird抛出错误。
 *
 * 3. Warning: a promise was created in a handler but none were returned from it
 * 前一级then没有return语句，导致后一级then的参数为undefined。
 *
 */

const Router = require('koa-router')
const businessRouter = require('./business/index')
const userRouter = require('./login/index')

const router = new Router({
  prefix: '/api/v1'
})

// need to check login status.
router.use(async (ctx, next) => {
  // TODO: check login.
  await next()
})

router.use(businessRouter.routes())
router.use(userRouter.routes())

module.exports = router
