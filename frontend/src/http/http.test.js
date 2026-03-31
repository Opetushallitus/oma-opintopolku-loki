import http from './http'

describe('http', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    global.fetch = jest.fn()
  })

  const url = '/test'
  const responseData = { status: 'ok' }
  const requestData = { foo: 'bar' }

  const mockFetchResponse = (data = responseData) => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(data)
    })
  }

  it('supports method get', async () => {
    mockFetchResponse()
    const response = await http.request(url, 'get')
    expect(response).toEqual({ data: responseData })
    expect(global.fetch).toHaveBeenCalledWith('http://localhost' + url)
  })

  it('supports method GET', async () => {
    mockFetchResponse()
    const response = await http.request(url, 'GET')
    expect(response).toEqual({ data: responseData })
    expect(global.fetch).toHaveBeenCalledWith('http://localhost' + url)
  })

  it('supports method post', async () => {
    mockFetchResponse()
    const response = await http.request(url, 'post', requestData)
    expect(response).toEqual({ data: responseData })
    expect(global.fetch).toHaveBeenCalledWith('http://localhost' + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Caller-Id': '1.2.246.562.10.00000000001.oma-opintopolku-loki.frontend',
        CSRF: undefined
      },
      body: JSON.stringify(requestData)
    })
  })

  it('supports method POST', async () => {
    mockFetchResponse()
    const response = await http.request(url, 'POST', requestData)
    expect(response).toEqual({ data: responseData })
    expect(global.fetch).toHaveBeenCalledWith('http://localhost' + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Caller-Id': '1.2.246.562.10.00000000001.oma-opintopolku-loki.frontend',
        CSRF: undefined
      },
      body: JSON.stringify(requestData)
    })
  })

  it('supports post with custom config', async () => {
    mockFetchResponse()
    const customConfig = { headers: { 'X-Custom': 'test' } }
    const response = await http.post(url, requestData, customConfig)
    expect(response).toEqual({ data: responseData })
    expect(global.fetch).toHaveBeenCalledWith('http://localhost' + url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Custom': 'test'
      },
      body: JSON.stringify(requestData)
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

  it('throws error on non-ok response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404
    })

    await expect(http.request(url, 'get')).rejects.toThrow('Request failed with status 404')
  })
})
