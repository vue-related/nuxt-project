/**
 * 获取配置信息：
 * 单例模式，只load一次，以后都取自缓存。
 * Uncaught Error: Function yaml.safeLoad is removed in js-yaml 4. Use yaml.load instead, which is now safe by default.
 *
 * 路径说明：
 * 1. path.resolve('./'): node命令执行的绝对路径，启动后就是不变的。
 * 2. __dirname: 使用它的文件的绝对路径，不同文件中使用结果会不同。
 * 3. require('./'): 相对与当前文件所在路径的路径，跟'__dirname'相同。
 */

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const _ = require('lodash')

// 全局的配置
const GlobalConfig = yaml.load(fs.readFileSync(path.join(__dirname, '../../configs/_config.yml'), 'utf8'))
const secretConfig = yaml.load(fs.readFileSync(path.join(__dirname, '../../configs/_secrets.yml'), 'utf8'))

function getGlobalConfig() {
  return _.defaultsDeep(secretConfig, GlobalConfig) || {}
}

// 安全门禁的配置
const piplineConfig = yaml.load(fs.readFileSync(path.join(__dirname, '../../configs/permision.yml'), 'utf8'))

function getPiplineConfig() {
  return piplineConfig || {}
}

module.exports = {
  getGlobalConfig,
  getPiplineConfig
}
