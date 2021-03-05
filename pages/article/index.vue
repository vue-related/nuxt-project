<template>
  <div>
    <div>this is article page.</div>
    <div v-if="rendering === 'server'">First load or hard refresh is done on server side.</div>
    <div v-else>Navigation is done on client side.</div>
    <nuxt-link to="/" rel="noopener noreferrer" class="button--green">go back home</nuxt-link>
  </div>
</template>

<script>
import { getArticle } from '~/api/article'
export default {
  layout: 'content',
  async asyncData({ $axios }) {
    debugger
    // const user = await $axios.$get('/user-info')
    return await { rendering: process.server ? 'server' : 'client' }
  },
  async mounted() {
    const user = await getArticle(this.$axios)
    console.log(user)
    await console.log('in mounted')
    // await this.$axios({
    //   url: '/server/user-info',
    //   method: 'get',
    //   params: {}
    // }).then(response => {
    //   console.log(response.data)
    //   this.user = response.data.name
    // })
  }
}
</script>
