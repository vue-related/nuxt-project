import Router from 'koa-router'

const router = new Router({
  prefix: '/login'
})

router.get('/user-info', async (ctx, next) => {
  debugger
  await console.log('in server middleware get:/login/user-info')
  ctx.response.status = 200
  ctx.response.type = 'application/json'
  ctx.response.body = { code: 20000, data: { name: 'bogking' }, message: '' }
})

export default router
