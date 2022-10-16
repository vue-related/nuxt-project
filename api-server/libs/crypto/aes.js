const crypto = require('crypto')
const key = require('../global-conf').getConfig().AESSecret || ''
const iv = '2624750004598718'

/**
 * 加密方法
 * @param key 加密key
 * @param iv       向量
 * @param data     需要加密的数据
 * @returns string
 */
function encryptWithIv_128cbc(data) {
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
  let crypted = cipher.update(data, 'utf8', 'binary')
  crypted += cipher.final('binary')
  crypted = Buffer.from(crypted, 'binary').toString('base64')
  return crypted
}

/**
 * 解密方法
 * @param key      解密的key
 * @param iv       向量
 * @param crypted  密文
 * @returns string
 */
function decryptWithIv_128cbc(crypted) {
  crypted = Buffer.from(crypted, 'base64').toString('binary')
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
  let decoded = decipher.update(crypted, 'binary', 'utf8')
  decoded += decipher.final('utf8')
  return decoded
}

function encrypt_128ecb(data) {
  const cipher = crypto.createCipher('aes-128-ecb', key)
  let crypted = cipher.update(data, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

function decrypt_128ecb(crypted) {
  const decipher = crypto.createDecipher('aes-128-ecb', key)
  let decrypted = decipher.update(crypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  return decrypted
}

module.exports = {
  encrypt_128ecb,
  decrypt_128ecb,
  encryptWithIv_128cbc,
  decryptWithIv_128cbc
}
