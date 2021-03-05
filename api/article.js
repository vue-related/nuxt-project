/**
 *
 * @param {*} axios
 * @param {*} data
 */
export function getArticle(axios, data) {
  return axios({ url: '/middleware/article', method: 'get', data })
}
