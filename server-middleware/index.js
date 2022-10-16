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
// my private modules
import apiRouter from './routers' // API接口路由

const router = new Router()
const app = new Koa()

router.use(async (ctx, next) => {
  await console.log('in router use')
  next()
})

// RESTFul API接口路由: /api/...
router.use(apiRouter.routes()).use(apiRouter.allowedMethods())
app.use(router.routes())
app.use(router.allowedMethods())

// serverMiddleware中应该是不需要配置404页面的，
// 因为本身是被挂载到局部路径上，不具备未匹配路由的拦截能力，这部分功能由nuxt内部实现了。
// 路由内部的错误由内部try...catch拦截，也不集中处理了。
app.on('error', function (err, ctx) {
  /* 错误的集中处理:
   * log 出来
   * 写入日志
   * 写入数据库
   *  ...
   */
  console.log(`logging error ${err.message}`)
})

export default {
  path: '/api/v1/server-middleware',
  handler: app.callback()
}
