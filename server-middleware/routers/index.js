import Router from 'koa-router'
import businessRouter from './business/index'
import userRouter from './login/index'

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

export default router
