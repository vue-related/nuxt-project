/**
 *
 * @param {*} axios
 * @param {*} data
 */
export function article(axios, data) {
  return axios({ url: '/article/', method: 'get', data })
}
