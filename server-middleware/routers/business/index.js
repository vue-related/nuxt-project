import Router from 'koa-router'

const router = new Router({
  prefix: '/business'
})

router.get('/article', async (ctx, next) => {
  debugger
  // await console.log('in server middleware get:/business/article')
  await timer()
  ctx.response.status = 200
  ctx.response.type = 'application/json'
  // const data = await { code: 20000, data: { goods: 1 }, message: '' }
  ctx.response.body = Object.assign({}, { code: 20000, data: { goods: 2 } })
})

function timer() {
  return new Promise(resolve => {
    setTimeout(function () {
      resolve()
    }, 3000)
  })
}

export default router
