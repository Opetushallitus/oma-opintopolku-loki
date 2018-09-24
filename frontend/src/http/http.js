import axios from 'axios'

const api = axios.create({
  baseURL: process.env.API_BASE_URL
})

const ext = axios.create()

const client = url => url.startsWith('http') ? ext : api

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
