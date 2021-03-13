//
const mongoose = require('mongoose')
const bbPromise = require('bluebird')
const debugMongo = require('debug')('starlab:mongo')
const globalConfig = require('../yaml/configLoader').getGlobalConfig()
const currentMode = globalConfig.currentMode
let DB_URL = ''
// let isDBConnected = false
mongoose.Promise = bbPromise

// such as:'mongodb://123.56.109.110:27017/test_mongo'.
DB_URL = `mongodb://${globalConfig.mongodb[currentMode].user}:${globalConfig.mongodb[currentMode].pwd}@
${globalConfig.mongodb[currentMode].ip}:${globalConfig.mongodb[currentMode].port}/${globalConfig.mongodb[currentMode].dbName}`

// connect to mongoDB.
/*
connect with promise:
mongoose.connect(uri, options).then(
  () => {
      // ready to use. The `mongoose.connect()` promise resolves to undefined.
  },
  err => {
    // handle initial connection error.
  }
);
*/
mongoose.connect(
  DB_URL,
  {
    /* useMongoClient: true,
    server: {
        auto_reconnect: true,
        poolSize: 10,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000,
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 30000
        }
    },
    replset: {
        socketOptions: {
            keepAlive: 1,
            connectTimeoutMS: 30000
        }
    } */
    // useMongoClient: true,
    // autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    // reconnectInterval: 1000,
    poolSize: 100,
    keepAlive: true,
    // connectTimeoutMS: 30000,
    // socketTimeoutMS: 0,
    useNewUrlParser: true
  },
  function (err) {
    if (!err) {
      // isDBConnected = true
      debugMongo('[mongodb][1]mongodb connected successfully.')
    } else {
      debugMongo('[mongodb][1]failed to connect mongodb.')
      throw err
    }
  }
)

// events.
mongoose.connection.on('connected', function () {
  debugMongo('[mongodb][connection]Mongoose connection connected.')
})
mongoose.connection.on('open', function () {
  debugMongo('[mongodb][connection]open successfully.')
})
mongoose.connection.on('disconnected', function () {
  debugMongo('[mongodb][connection]Mongoose connection disconnected')
})
mongoose.connection.on('error', function (err) {
  debugMongo('[mongodb][connection]Mongoose connection error: ' + err)
})

module.exports = mongoose
