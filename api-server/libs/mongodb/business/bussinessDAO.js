const debugMongo = require('debug')('starlab:mongo')
const mongoose = require('../connection')

module.exports = {
  updateUserStatistic: (obj, conditions) => {
    // var that = this;
    /*
     obj.count(conditions).then(
      function (len) {
        debugMongo('mongodb][2]count successfully: ' + len)
        if (len) {
          obj.findOneAndUpdate({ userName: conditions.userName }, { $inc: { count: 1 } }, { upsert: true }).then(
            function (doc) {
              debugMongo('update success: ' + doc)
            },
            function (err) {
              debugMongo('update failed: ' + err)
            }
          )
        } else {
          var mongo_user = new obj({
            userName: conditions.userName,
            count: 1
          })
          that.add(mongo_user)
        }
      },
      function (err) {
        debugMongo('mongodb][2]count failed: ' + err)
      }
    )
    */

    // in another short way.
    obj.findOneAndUpdate({ userName: conditions.userName, groupType: conditions.groupType }, { $inc: { count: 1 } }, { upsert: true }).then(
      function (doc) {
        debugMongo('update success: ' + doc)
      },
      function (err) {
        debugMongo('update failed: ' + err)
      }
    )
  },
  findMonthStatistics: (obj, conditions, fields, options) => {
    if (undefined === conditions) conditions = {}
    if (undefined === fields) fields = { month: 1, count: 1, _id: 0 }
    if (undefined === options) options = {}

    return obj
      .find(conditions, fields, options)
      .sort({ month: -1 })
      .limit(10)
      .exec()
      .then(
        function (d) {
          debugMongo('mongodb][2]find month statistics successfully: ' + typeof d)
          return d
        },
        function (err) {
          debugMongo('mongodb][2]find month statistics filed: ' + err)
          return err
        }
      )
  },
  updateApproveStatus: (obj, conditions, update) => {
    // options:
    // { $inc: { count: 1 } }
    //
    return obj.findOneAndUpdate({ _id: mongoose.Types.ObjectId(conditions.applyId) }, update, { upsert: true }).then(
      function (doc) {
        debugMongo('update success: ' + doc)
      },
      function (err) {
        debugMongo('update failed: ' + err)
      }
    )
  }
}
