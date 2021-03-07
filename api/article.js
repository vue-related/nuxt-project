/**
 * 用户管理的接口，通常用于store的action中，归一化管理，避免散落到各处，会造成难以维护的问题。
 */
export function login($axios, params) {
  return $axios({
    url: '/server-middleware/user/login',
    method: 'post',
    data: params
  })
}

export function getInfo($axios, params) {
  return $axios({
    url: '/server-middleware/user/info',
    method: 'get',
    params
  })
}

export function logout($axios) {
  return $axios({
    url: '/server-middleware/user/logout',
    method: 'post'
  })
}

export function getArticle($axios, params) {
  // 写法一：正常执行plugin/axios.js拦截器
  // return $axios({ url: '/server-middleware/article', method: 'get', params })
  // 写法二：正常执行plugin/axios.js拦截器，但注意返回值是res.data的内容
  return $axios.$get('/server-middleware/article', params)
}

export function getPermission($axios, params) {}
