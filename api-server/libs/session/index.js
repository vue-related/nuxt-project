const session = require('koa-session')
const RedisStore = require('koa-redis')
const { getGlobalConfig } = require('../yaml/configLoader')

const gConfig = getGlobalConfig()
const mode = gConfig.runMode

// TODO: use 'KeyGrip' to sign.
const config = {
  prefix: 'sess:', // 给session对象在redis存储的地址名前面添加的前缀内容
  key: gConfig.cookie.key, // cookie key (default is 'koa:sess')
  maxAge: gConfig.cookie.maxAge.short, // cookie的过期时间 maxAge in ms (default is 1 days)
  overwrite: true, // 是否可以overwrite    (默认default true)
  httpOnly: true, // cookie是否只有服务器端可以访问 httpOnly or not (default true)
  signed: true, // 签名默认true
  rolling: false, // 在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
  renew: false, // (boolean) renew session when session is nearly expired,
  store: new RedisStore({
    host: gConfig.redis[mode].ip, // Redis host
    port: gConfig.redis[mode].port, // Redis port
    password: gConfig.redis[mode].pwd, // gConfig.redis[mode].pwd,
    family: 4, // 4 (IPv4) or 6 (IPv6)
    // prefix: 'sam:', // 不管外层是否设置，这个属性都不生效
    // ttl: 3600,
    db: gConfig.redis[mode].db
  })
}

module.exports = {
  session,
  sessConfig: config
}
