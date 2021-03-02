function delay(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log(`time out:${time}`)
      resolve('cc')
    }, time)
  })
}

function date2String(time) {
  let res = 0
  try {
    res = time.getTime().toString()
  } catch (err) {
    res = time.toString()
  }
  return res
}

module.exports = { delay, date2String }
