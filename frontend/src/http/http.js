import axios from 'axios'

const client = axios.create()

const get = async url => client(url).get(url)
const post = async (url, data) => client(url)({ method: 'post', url, data })

const request = async (url, method, data = {}) => {
  switch (method) {
    case 'GET':
    case 'get':
      return get(url)
    case 'POST':
    case 'post':
      return post(url, data)
    default:
      throw new Error(`Unsupported HTTP method: ${method}`)
  }
}

export default {
  get,
  post,
  request
}
