/**
 * axios文档：https://axios.nuxtjs.org/helpers
 * 下述配置与axios配置写法不同，是@nuxtjs/axios定制的写法
 */
import { MessageBox, Message } from 'element-ui'
// import { getToken } from '~/libs/auth'

export default function ({ $axios, store, redirect, error: nuxtError }) {
  // request interceptor
  $axios.onRequest(
    config => {
      // do something before request is sent
      debugger
      console.log('Making request to ' + config.url)

      // if (store.state.token) {
      //   // let each request carry token
      //   // ['X-Token'] is a custom headers key
      //   // please modify it according to the actual situation
      //   config.headers['X-Token'] = getToken()
      // }
      return config
    },
    error => {
      // do something with request error
      console.log(error) // for debug
      return Promise.reject(error)
    }
  )

  /**
   * response interceptor
   * If you want to get http information such as headers or status
   * Please return  response => response
   *
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  $axios.onResponse(
    response => {
      // console.log('response data is: ' + response.data)
      debugger
      const res = response.data
      res.isResCorrect = true
      // if the custom code is not 20000, it is judged as an error.
      if (res.code !== 20000) {
        res.isResCorrect = false

        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })

        // 20008: Illegal token; 20009: Other clients logged in; 20010: Token expired;
        if (res.code === 20008 || res.code === 20009 || res.code === 20010) {
          // to re-login
          MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
            confirmButtonText: 'Re-Login',
            cancelButtonText: 'Cancel',
            type: 'warning'
          }).then(() => {
            store.dispatch('resetToken').then(() => {
              location.reload()
            })
          })
        }

        // nuxtjs的axios监听器中无法阻止请求promise进入失败回调，只能返回状态，在请求中处理。
        // throw new Error('backend api request failed') // 抛异常无效，无法进入请求promise的失败回调
        // return Promise.reject(new Error(res.message || 'Error')) // 返回promise.reject也，无法进入请求promise的失败回调
        return res
      } else {
        return res
      }
    },
    error => {
      console.log('err' + error) // for debug
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(error)
    }
  )

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    // console.log('err' + error) // for debug

    // 通过重定向，可以指向任何页面，但异常时一般是跳转到准备好的异常页面
    // if (code === 400) {
    //   redirect('/400')
    // }

    // 用error方式，统一跳转/layout/error.vue，显示定制的错误内容，这种更好
    nuxtError({
      statusCode: code,
      message: error.message
    })

    // When intercepting an error, you can return a resolved promise to prevent the error from propagating.
    return Promise.resolve(false) // 通过resolve promise阻止error事件的继续传播
  })
}
