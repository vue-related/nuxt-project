const mongoose = require('../connection')

// schema definition.
const Schema = mongoose.Schema
// type: String, Date, Boolean, Number, Array.

const itemSchema = new mongoose.Schema({
  userName: String,
  userId: String,
  ESN: String,
  MAC: String,
  days: Number,
  verified: Boolean
})

const applicationSchema = new Schema({
  userName: String, // bogking
  accountName: String, // bogking
  userNo: String, // 编号
  email: String,
  mobile: String,
  country: String, // 国家
  age: String,
  groupType: String,
  date: {
    // 申请日期
    type: Date,
    default: Date.now
  },
  applyList: [itemSchema],
  applyStatus: String, // 申请状态："success"/"fail"/"processing"
  approver: String,
  applicationReason: String // 申请原因
})

// instance methods are for document object.
// methods must be added to the schema before compiling it with mongoose.model().

// query helpers are for model object.
// statics are for model object.

module.exports = applicationSchema
