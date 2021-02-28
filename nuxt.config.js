export default {
  mode: 'universal',
  telemetry: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'nuxt3-project',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }, { hid: 'description', name: 'description', content: '' }],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  router: {
    // middleware: 'permission'
  },
  // Customize the progress-bar color
  loading: { color: '#fff' },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['element-ui/lib/theme-chalk/index.css', { src: '~/assets/index.scss' }],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['@/plugins/element-ui', '~/plugins/axios'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/proxy'
  ],

  serverMiddleware: ['~/server-middleware/koa'],

  // axios与proxy模块的说明：
  // axios.proxy:false: nuxt仅将axios请求匹配serverMiddleware，匹配到就执行，匹配不到就404。
  // axios.proxy:true: 与serverMiddleware相同的路径规则，serverMiddleware优先匹配，其次匹配proxy中的规则，按配置代理到api server，都未匹配的就404。
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // baseURL: `http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 3010}/api/v1`, // url = base url + request url
    prefix: 'api/v1',
    // withCredentials: true, // send cookies when cross-domain requests
    progress: true, // true as default
    retry: { retries: 3 },
    proxy: false, // Can be also an object with default options.
    timeout: 5000 // request timeout
  },
  proxy: {
    '/api/': { target: 'http://localhost:3010/', pathRewrite: { '^/api/': '/api' }, changeOrigin: true }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [/^element-ui/]
  },
  // You can extend webpack config here
  extend(config, ctx) {}
}
