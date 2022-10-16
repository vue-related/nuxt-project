import { setCookie, getCookie, removeCookie } from './cookieAdaptor'

const TokenKey = 'sm_token'

export function getToken() {
  return getCookie(TokenKey)
}

export function setToken(token, options = {}) {
  return setCookie(TokenKey, token, options)
}

export function removeToken() {
  return removeCookie(TokenKey)
}

// 获取服务端cookie
export function getTokenInServer(req) {
  const serviceCookie = {}

  if (req && req.headers.cookie) {
    req.headers.cookie.split(';').forEach(function (val) {
      const parts = val.split('=')
      serviceCookie[parts[0].trim()] = (parts[1] || '').trim()
    })
  }

  return serviceCookie[TokenKey] ? serviceCookie[TokenKey] : ''
}

// 获取客户端cookie
export function getTokenInClient() {
  return getCookie(TokenKey) ? getCookie(TokenKey) : ''
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}
