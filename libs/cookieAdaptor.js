import Cookie from 'js-cookie'

export function setCookie(key, value, options = {}) {
  // js-cookie bug:
  // 仅支持expires，并不支持maxAge，如果要用maxAge需要用下述形式：
  // 'Max-Age': (parseInt(maxAge)/1000).toString() // 它的单位是秒，后端maxAge单位是毫秒
  const { expires, maxAge } = options

  return Cookie.set(key, value, {
    expires,
    'Max-Age': (parseInt(maxAge) / 1000).toString()
  })
}

export function getCookie(key) {
  return Cookie.get(key)
}

export function removeCookie(key) {
  return Cookie.remove(key)
}
