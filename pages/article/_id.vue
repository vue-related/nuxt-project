<template>
  <div>
    <div>this is article page.</div>
    {{ user }}
  </div>
</template>

<script>
export default {
  layout: 'content',
  async asyncData({ $axios }) {
    debugger
    console.log('lala')
    // const user = await $axios.$get('/user-info')
    return await { user: 123 }
  },
  mounted: {}
}
</script>
