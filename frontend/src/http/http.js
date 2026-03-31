import Cookies from 'js-cookie'

const baseURL = window.location.protocol + '//' + window.location.host
const callerId = '1.2.246.562.10.00000000001.oma-opintopolku-loki.frontend'

const handleResponse = async response => {
  if (!response.ok) {
    const error = new Error(`Request failed with status ${response.status}`)
    error.response = response
    throw error
  }
  const data = await response.json()
  return { data }
}

const get = async url =>
  handleResponse(await fetch(baseURL + url))

const post = async (url, data, config = {
  headers: {
    'Caller-Id': callerId,
    CSRF: Cookies.get('CSRF')
  }
}) =>
  handleResponse(await fetch(baseURL + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...config.headers
    },
    body: JSON.stringify(data)
  }))

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
