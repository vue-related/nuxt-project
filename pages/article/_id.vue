<template>
  <div>
    <div>this is article page.</div>
    <div>
      {{ user }}
    </div>
    <nuxt-link to="/" rel="noopener noreferrer" class="button--green">go back home</nuxt-link>
  </div>
</template>

<script>
import { article } from '~/api/article'
export default {
  layout: 'content',
  async asyncData({ $axios }) {
    debugger
    // const user = await $axios.$get('/user-info')
    const user = article($axios)
    return await { user }
  }
  // mounted: {}
}
</script>
