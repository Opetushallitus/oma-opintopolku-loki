import 'service/raamitSupport'

import http from '../http/http'

describe('RaamitSupport', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return user name', () => {
    http.get = jest.fn(() =>
      Promise.resolve({
        data: {
          etunimet: 'Onni Oskari',
          sukunimi: 'Oppija',
          hetu: '010280-ABC1'
        }
      })
    )
    const service = global.Service

    return service.getUser().then(data => {
      expect(data).toEqual({ name: 'Onni Oskari Oppija' })
      expect(http.get).toHaveBeenCalledTimes(1)
    })
  })

  it('should not implement login', () => {
    const service = global.Service
    expect(service.login).toThrow()
  })

  it('should forward to logout url', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { assign: jest.fn() }
    })
    const service = global.Service
    service.logout()
    expect(window.location.assign).toHaveBeenCalledWith('/cas-oppija/logout?service=/oma-opintopolku/')
    window.location.assign.mockRestore()
  })
})
