import axios from 'axios'
import Cookies from 'js-cookie'

const client = axios.create({
  baseURL: window.location.protocol + '//' + window.location.host
})

const callerId = '1.2.246.562.10.00000000001.oma-opintopolku-loki.frontend'

const get = async url => client.get(url)
const post = async (url, data, config) => client.post(url, data, config)

const request = async (url, method, data = {}, config = {
  headers: {
    'Caller-Id': callerId,
    CSRF: Cookies.get('CSRF')
  }
}) => {
  switch (method) {
    case 'GET':
    case 'get':
      return get(url)
    case 'POST':
    case 'post':
      return post(url, data, config)
    default:
      throw new Error(`Unsupported HTTP method: ${method}`)
  }
}

export default {
  get,
  post,
  request
}
