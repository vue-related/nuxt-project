// import { getToken } from '~/libs/auth' // getToken from cookie
import { getTokenInServer, getTokenInClient } from '~/libs/auth'
/**
 * 路由鉴定：一些页面游客无权限访问，或登陆超时等，需要拦截登陆。
 * 中间件只有在路由变化时执行，首次加载或刷新时不会执行，nuxt通过在server端执行一次，以弥补中间件被全场景执行。
 * 跳转新标签使用middleware中间件在server端请求数据，此时提交到vuex store，发现并不能更新store，而且数据不一致。使用nuxtServerInit来初始化即可。
 *
 * 路由顺序：
 * 1. 根据目标路由，执行路由匹配，如果匹配不到，跳转404，即nuxt的layout/error.vue。
 * 2. 匹配到了目标路由，根据全局和目标路由的导航守卫配置，按优先级依次执行守卫，守卫中做拦截和重定向。
 * 3. 每个匹配到的中间件分两种执行场景：页面加载，在服务端执行一次，加载完成后，在客户端每次路由切换时执行。
 * 4. 渲染目标路由对应的页面。
 *
 * @param {*} context: nuxt global obj, 包括:
 * 属性字段				类型			   可用				      描述
 * app						Vue根实例		客户端 & 服务端		包含所有插件的Vue根实例。例如：在使用 axios 的时候，你想获取 $axios 可以直接通过 context.app.$axios 来获取
 * isClient				Boolean			客户端 & 服务端		是否来自客户端渲染（废弃。请使用 process.client ）
 * isServer				Boolean			客户端 & 服务端		是否来自服务端渲染（废弃。请使用 process.server ）
 * isStatic				Boolean			客户端 & 服务端		是否来自 nuxt generate 静态化（预渲染）（废弃。请使用 process.static ）
 * isDev					Boolean			客户端 & 服务端		是否是开发 dev 模式，在生产环境的数据缓存中用到
 * isHMR					Boolean			客户端 & 服务端		是否是通过模块热替换 webpack hot module replacement (仅在客户端以 dev 模式)
 * route					Vue Router路由	客户端 & 服务端		Vue Router 路由实例
 * store					Vuex数据		客户端 & 服务端		Vuex.Store实例。只有vuex数据流存在相关配置时可用
 * env						Object			客户端 & 服务端		nuxt.config.js 中配置的环境变量，见 环境变量 api
 * params					Object			客户端 & 服务端		route.params 的别名
 * query					Object			客户端 & 服务端		route.query 的别名
 * req						http.Request	服务端				 Node.js API 的 Request 对象。如果 Nuxt 以中间件形式使用的话，这个对象就根据你所使用的框架而定。nuxt generate 不可用
 * res						http.Response	服务端				 Node.js API 的 Response 对象。如果 Nuxt 以中间件形式使用的话，这个对象就根据你所使用的框架而定。nuxt generate 不可用
 * redirect				Function		客户端 & 服务端		用这个方法重定向用户请求到另一个路由。状态码在服务端被使用，默认 302 redirect([status,] path [, query])
 * error					Function		客户端 & 服务端		用这个方法展示错误页：error(params) 。params 参数应该包含 statusCode 和 message 字段
 * nuxtState				Object			客户端				  Nuxt 状态，在使用 beforeNuxtRender 之前，用于客户端获取 Nuxt 状态，仅在 universal 模式下可用
 * beforeNuxtRender(fn)	Function		服务端			使用此方法更新 __NUXT__ 在客户端呈现的变量，fn 调用 (可以是异步) { Components, nuxtState } ，参考 示例
 */

export default function ({ route, store, redirect, req, res }) {
  // await store.dispatch('GetUserInfo')

  const isClient = process.client
  const isServer = process.server
  let redirectURL = '/login'
  let token, path

  // 获取UA，后续拦截爬虫
  // store.commit('SET_UA', isServer ? req.headers['user-agent'] : navigator.userAgent)

  // 在服务端执行
  if (isServer) {
    token = getTokenInServer(req)
    path = req.originalUrl
  }

  // 在客户端执行
  if (isClient) {
    token = getTokenInClient()
    path = route.path
  }

  if (path) {
    redirectURL = `${redirectURL}?redirect=` + encodeURIComponent(path)
  }

  // 根据用户登陆状态做跳转拦截
  if (!token) {
    redirect(redirectURL)
    // return redirect(redirectURL)
  }
}
