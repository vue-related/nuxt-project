<template>
  <div>
    <div>this is article page.</div>
    <div v-if="rendering === 'server'">First load or hard refresh is done on server side.</div>
    <div v-else>Navigation is done on client side.</div>
    <nuxt-link to="/" rel="noopener noreferrer"><el-button type="success">go to home</el-button></nuxt-link>
  </div>
</template>

<script>
import { getArticle } from '~/api/article'
export default {
  layout: 'content',
  async asyncData({ $axios }) {
    // 写法一：使用axios，正常执行plugins/axios.js拦截器.
    // await $axios({
    //   url: '/middleware/article',
    //   method: 'get',
    //   params: {}
    // }).then(response => {
    //   console.log(response)
    // })
    // 写法二：使用axios.methods，正常执行plugins/axios.js拦截器，
    // 但method会返回res.data内的数据，plugins/axios.js要注意$axios()和$axios.$get()两种写法的返回值，不建议混用.
    // const user = await $axios.$get('/middleware/article')
    // console.log(`user is ${JSON.stringify(user)}`)
    // 写法三：推荐写法，调用api，正常执行plugins/axios.js拦截器
    // const user = await getArticle($axios)
    // debugger
    // console.log(user)

    return await { rendering: process.server ? 'server' : 'client' }
  },
  async mounted() {
    await console.log('in mounted')
    const user = await getArticle(this.$axios)
    debugger
    console.log(user)
  }
}
</script>
