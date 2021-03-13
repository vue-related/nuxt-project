const mongoose = require('../connection')
const schema = require('./safeFuncGuardSchema')

// 实例化模型，形成文档（对应关系数据库中的记录）
module.exports = function (obj) {
  // console.log(JSON.stringify(schema));
  // 可以不用schema，直接放schema对象：{name: String, age: Number}
  if (obj) {
    return mongoose.model(obj, schema)
  } else {
    return mongoose.model('license_apply_application', schema)
  }
}
