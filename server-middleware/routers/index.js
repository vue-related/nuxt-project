const Router = require('koa-router')
const businessRouter = require('./business/index')
const userRouter = require('./login/index')

const router = new Router({
  // prefix: '/'
})

// need to check login status.
router.use(async (ctx, next) => {
  // TODO: check login.
  await next()
})

router.use(businessRouter.routes())
router.use(userRouter.routes())

module.exports = router
