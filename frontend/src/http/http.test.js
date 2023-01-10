import http from './http'

import mockAxios from 'axios'

describe('http', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockAxios.get.mockImplementationOnce(() => Promise.resolve(responseData))
    mockAxios.post.mockImplementationOnce(() => Promise.resolve(responseData))
  })

  const url = 'http://localhost'
  const responseData = { status: 'ok' }
  const requestData = { foo: 'bar' }
  const headers = { headers: { CSRF: undefined, 'Caller-Id': '1.2.246.562.10.00000000001.oma-opintopolku-loki.frontend' } }

  it('supports method get', () => {
    return http.request(url, 'get').then(response => {
      expect(response).toEqual(responseData)
      expect(mockAxios.get).toHaveBeenCalledWith(url)
    })
  })

  it('supports method GET', () => {
    return http.request(url, 'GET').then(response => {
      expect(response).toEqual(responseData)
      expect(mockAxios.get).toHaveBeenCalledWith(url)
    })
  })

  it('supports method post', () => {
    return http.request(url, 'post', requestData).then(response => {
      expect(response).toEqual(responseData)
      expect(mockAxios.post).toHaveBeenCalledWith(url, requestData, headers)
    })
  })

  it('supports method POST', () => {
    return http.request(url, 'POST', requestData).then(response => {
      expect(response).toEqual(responseData)
      expect(mockAxios.post).toHaveBeenCalledWith(url, requestData, headers)
    })
  })

  it('throws error for unsupported methods', async () => {
    let err

    try {
      await http.request(url, 'options')
    } catch (e) {
      err = e
    }

    expect(err.message).toBe('Unsupported HTTP method: options')
  })
})
