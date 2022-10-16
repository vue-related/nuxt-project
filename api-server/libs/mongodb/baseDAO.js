const debugMongo = require('debug')('starlab:mongo')

module.exports = {
  // 示例：
  // const doc = new xxModel({key:val}) // document是model的对象，model内是对schema对象的赋值
  // doc.save().then() // 将document对象保存到model对应的集合中
  add: obj => {
    // obj is document.
    obj.save().then(
      function (d) {
        debugMongo('[mongodb][2]save successfully: ' + d)
      },
      function (err) {
        debugMongo('[mongodb][2]save failed: ' + err)
      }
    )
  },
  // 条件查询：Model.find(conditions, [fields], [options], [callback])
  find: (obj, conditions, fields, options) => {
    if (undefined === conditions) conditions = {}
    if (undefined === fields) fields = {}

    obj.find(conditions, fields).then(function (err, docs) {
      if (err) return console.error(err)
      console.log(docs)
      return docs
    })
  },
  // 根据_id查询：Model.findById(id, [fields], [options], [callback])
  findById: (obj, id, fields, options) => {
    if (undefined === id) return
    if (undefined === fields) fields = {}

    obj.findById(id).then(function (err, doc) {
      if (err) return console.error('mongo: ' + err)
      console.log('mongo: ' + doc)
      return doc
    })
  },
  // Model.remove(conditions, [callback])
  // Model.findByIdAndRemove(id, [options], [callback])
  // Model.findOneAndRemove(conditions, [options], [callback])
  delete: (obj, conditions) => {
    obj.remove(conditions).then(function (err, res) {
      // res中会返回是否成功以及影响的行数：{"ok":1,"n":1}
      if (err) {
        return console.log('Error:' + err)
      }
      console.log('Res:' + res)
    })
  },
  // Model.update(conditions, update, [options], [callback])
  update: (obj, conditions, update) => {
    obj.update(conditions, update).then(function (err, res) {
      if (err) {
        return console.log('Error:' + err)
      }
      console.log('Res:' + res)
    })
  },
  // Model.findByIdAndUpdate(id, [update], [options], [callback])
  findByIdAndUpdate: (obj, id, update) => {
    obj.findByIdAndUpdate(id, update).then(function (err, res) {
      if (err) {
        return console.log('Error:' + err)
      }
      console.log('Res:' + res)
    })
  },
  // Model.findOneAndUpdate([conditions], [update], [options], [callback])
  findOneAndUpdate: (obj, conditions, update) => {
    obj.findOneAndUpdate(conditions, update).then(function (err, res) {
      if (err) {
        return console.log('Error:' + err)
      }
      console.log('Res:' + res)
    })
  },
  findByPage: (obj, conditions, fields, options) => {
    if (undefined === conditions) conditions = {}
    if (undefined === fields) fields = {}

    const pageSize = 5 // 一页多少条
    const currentPage = 1 // 当前第几页
    const sort = { logindate: -1 } // 排序（按登录时间倒序）
    const condition = {} // 条件
    const skipnum = (currentPage - 1) * pageSize // 跳过数

    obj
      .find(condition)
      .skip(skipnum)
      .limit(pageSize)
      .sort(sort)
      .exec()
      .then(function (err, res) {
        if (err) {
          console.log('Error:' + err)
        } else {
          console.log('Res:' + res)
        }
      })
  },
  findOne: (obj, conditions) => {
    obj.findOne(conditions).then(function (err, doc) {
      if (err) return console.error(err)
      console.log(doc)
      return doc
    })
  },
  // Model.count(conditions, [callback])
  count: (obj, conditions) => {
    if (undefined === conditions) conditions = {}

    obj.count(conditions).then(function (err, num) {
      if (err) return console.error(err)
      console.log(num)
      return num
    })
  }
}
