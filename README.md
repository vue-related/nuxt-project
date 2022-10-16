# nuxt3-template

## Build Setup

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

# 部署

pm2 start ./node_modules/nuxt/bin/nuxt -- start #不带 start 参数是以 dev 开发者模式启动的，导致加载速度很慢

# 待完成

1. 完全用serverMiddleware实现服务端功能。
2. 独立的api server实现服务端功能。
3. nuxt pm2多进程部署。
4. --------------------------------
5. axios写法整理：nuxt plugins的axios受return值的影响么？
6. export(default)/import、require/module.exports、nodejs中使用import/export、koa中使用import/export。
7. 前端安全：xss。

