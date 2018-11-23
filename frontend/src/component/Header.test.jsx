import React from 'react'
import Header from './Header'
import { create } from 'react-test-renderer'
import http from '../http/http'

describe('Header', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should be rendered', (done) => {
    http.request = jest.fn(() =>
      Promise.resolve({
        data: {
          etunimet: 'Onni Oskari',
          sukunimi: 'Oppija',
          hetu: '010280-ABC1'
        }
      })
    )

    const renderer = create(<Header/>)

    setTimeout(() => {
      const componentJSON = renderer.toJSON()
      expect(componentJSON).toMatchSnapshot()
      renderer.unmount()

      expect(http.request).toHaveBeenCalledTimes(1)

      done()
    })
  })
})
