// 方式一：常规写法
// export default function (req, res, next) {
//   console.log(req.url)
//   next()
// }

// 方式二：express
// import express from 'express'
// const app = express()

// app.use('/', (req, res) => {
//   // Validate, sanitize and send
//   res.send({ a: 1 })
// })

// export default {
//   path: '/api',
//   handler: app
// }

// 方式三：koa
// serverMiddleware中koa与独立使用时行为不同:
// nuxt中的koa: 需要有具体method的路由匹配时，才会执行部分匹配的use回调，否则不会执行use()。
// koa独立使用: 即使最终没有匹配到具体method的路由，也会按照定义顺序执行局部匹配的use()。
import Koa from 'koa'
import Router from 'koa-router'
const router = new Router()
const app = new Koa()

router.use(async (ctx, next) => {
  await console.log('in router use')
  next()
})

router.get('/uuuq', async (ctx, next) => {
  await console.log('in router get')
  next()
  ctx.response.status = 200
  ctx.response.type = 'application/json'
  ctx.response.body = Object.assign({}, { name: 'a', age: 1 }, { c: 333 })
})

app.use(router.routes())
app.use(router.allowedMethods())
export default {
  path: '/api',
  handler: app.callback()
}
