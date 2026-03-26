import { nav } from 'service/raamitSupport'

import http from '../http/http'

describe('RaamitSupport', () => {
  let assignSpy

  beforeEach(() => {
    jest.resetAllMocks()
    assignSpy = jest.spyOn(nav, 'assign').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
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

  it('should forward to Opintopolku login', () => {
    const service = global.Service
    service.login()
    expect(assignSpy).toHaveBeenCalledWith('/oma-opintopolku/authenticate')
  })

  it('should forward to logout url', () => {
    const service = global.Service
    service.logout()
    expect(assignSpy).toHaveBeenCalledWith('/koski/user/logout?target=/oma-opintopolku')
  })
})
