import axios from 'axios'

const client = axios.create({
  baseURL: process.env.API_BASE_URL
})

const get = async url => client.get(url)
const post = async (url, data) => client.post(url, data)

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
