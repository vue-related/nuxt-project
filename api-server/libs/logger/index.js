const log4js = require('log4js')
const log4koa = require('koa-log4')
const { getGlobalConfig } = require('../yaml/configLoader')

const gConfig = getGlobalConfig()

log4js.configure({
  appenders: {
    // 单文件日志：记录关键日志，到dataFile中查找完整日志
    oneFile: {
      type: 'file',
      filename: `${gConfig.log.path}/run.log`, // 文件目录，当目录文件或文件夹不存在时，会自动创建
      // 日志先写入running.log，达到200byte将其重命名为running.log.1，
      // 原running.log.1重命名为running.log.2，最多保留3个副本，不包括running.log。
      // 做一次备份就要改动全部文件，如果副本数很大，会影响性能吧？
      maxLogSize: gConfig.log.maxLogSize, // 文件最大存储空间，当文件内容超过文件存储空间会自动生成一个文件test.log.1的序列自增长的文件
      backups: gConfig.log.backups, // 当文件内容超过文件存储空间时，备份文件的数量
      compress: false, // 是否以压缩的形式保存新文件,默认false。如果true，则新增的日志文件会保存在gz的压缩文件内，并且生成后将不被替换，false会被替换掉
      encoding: 'utf-8' // default "utf-8"，文件的编码
    },
    // 每日日志：按天归档，便于快速按时间查找事件上下文
    dateFile: {
      type: 'dateFile',
      filename: `${gConfig.log.path}/date-log`,
      pattern: 'yyyy-MM-dd.log', // （可选，默认为.yyyy-MM-dd） - 用于确定何时滚动日志的模式。格式:.yyyy-MM-dd-hh:mm:ss.log
      alwaysIncludePattern: true, // （默认为false） - 将模式包含在当前日志文件的名称以及备份中
      // keepFileExt : true,
      compress: false, // （默认为false） - 在滚动期间压缩备份文件（备份文件将具有.gz扩展名）
      encoding: 'utf-8' // default "utf-8"，文件的编码
    },
    // 打印到控制台，主要用于开发调测
    console: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'trace'
    },
    run_log: {
      appenders: gConfig.runMode === 'development' ? ['console'] : ['dateFile'],
      level: 'debug'
    },
    error_log: {
      appenders: gConfig.runMode === 'development' ? ['console'] : ['dateFile', 'oneFile'],
      level: 'error'
    }
  },
  replaceConsole: true,
  pm2InstanceVar: 'INSTANCE_ID',
  pm2: true
})

// name的取值为log4js中categories配置中的项
exports.log4koa = name => log4koa.koaLogger(log4js.getLogger(name || 'run_log'))

exports.getLogger = name => log4js.getLogger(name || 'default')

exports.connectLogger = log4js.connectLogger
