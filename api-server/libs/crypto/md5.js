const fs = require('fs')
const crypto = require('crypto')
const BbPromise = require('bluebird')

/**
 * 计算md5校验和。
 * @param  {string} type  :类型，"file":计算文件md5，"string":计算字符串md5.
 * @param  {string} value :"file" type, value is file path，"string" type, vaule is origin string.
 * @return {string}       :结果MD5字符串.
 */
function md5CheckSum(type, value) {
  const md5sum = crypto.createHash('md5')

  return new BbPromise(function (resolve, reject) {
    if (type === 'file') {
      const stream = fs.createReadStream(value)
      stream.on('data', function (chunk) {
        md5sum.update(chunk)
      })

      stream.on('end', function () {
        const result = md5sum.digest('hex')
        resolve(result)
      })
    } else if (type === 'string') {
      md5sum.update(value)
      const result = md5sum.digest('hex')
      resolve(result)
    }
  })
}

module.exports = {
  md5CheckSum
}
