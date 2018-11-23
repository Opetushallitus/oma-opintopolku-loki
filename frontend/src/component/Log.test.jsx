import React from 'react'
import Log from './Log'
import { create } from 'react-test-renderer'
import http from '../http/http'
import * as preferences from 'util/preferences'

describe('Log', () => {
  const logData = [
    {
      organizations: [
        {
          oid: '1.1.111.111.11.11111111111',
          name: { fi: 'Organisaatio 1', sv: 'Organisation 1', en: 'Organization 1' }
        }
      ],
      timestamps: ['2018-09-19T12:05:26.432+03', '2018-09-20T16:01:44.543+03']
    },
    {
      organizations: [
        {
          oid: '2.2.222.222.22.22222222222',
          name: { fi: 'Test 2', sv: 'Test 2', en: 'Test 2' }
        }
      ],
      timestamps: ['2018-07-19T21:38:35.104+03', '2018-08-26T18:56:17.437+03', '2017-06-07T23:58:55.136+03']
    }
  ]

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render with empty log', (done) => {
    http.request = jest.fn(() => Promise.resolve({ data: [] }))

    const renderer = create(<Log/>)

    setTimeout(() => {
      const componentJSON = renderer.toJSON()
      expect(componentJSON).toMatchSnapshot()
      renderer.unmount()

      expect(http.request).toHaveBeenCalledTimes(1)

      done()
    })
  })

  it('should render with non-empty log', (done) => {
    http.request = jest.fn(() => Promise.resolve({ data: logData }))

    const renderer = create(<Log/>)

    setTimeout(() => {
      const componentJSON = renderer.toJSON()
      expect(componentJSON).toMatchSnapshot()
      renderer.unmount()

      expect(http.request).toHaveBeenCalledTimes(1)

      done()
    })
  })

  it('should render with non-empty log and language en', (done) => {
    http.request = jest.fn(() => Promise.resolve({ data: logData }))
    const originalLang = preferences.lang
    preferences.lang = 'en'

    const renderer = create(<Log/>)

    setTimeout(() => {
      const componentJSON = renderer.toJSON()
      expect(componentJSON).toMatchSnapshot()
      renderer.unmount()
      preferences.lang = originalLang

      expect(http.request).toHaveBeenCalledTimes(1)

      done()
    })
  })

  it('should render with non-empty log and language sv', (done) => {
    http.request = jest.fn(() => Promise.resolve({ data: logData }))
    const originalLang = preferences.lang
    preferences.lang = 'sv'

    const renderer = create(<Log/>)

    setTimeout(() => {
      const componentJSON = renderer.toJSON()
      expect(componentJSON).toMatchSnapshot()
      renderer.unmount()
      preferences.lang = originalLang

      expect(http.request).toHaveBeenCalledTimes(1)

      done()
    })
  })

  it('should render with non-empty log and organization with no English name', (done) => {
    const data = [
      {
        organizations: [
          {
            oid: '1.1.111.111.11.11111111111',
            name: { fi: 'Organisaatio 1', sv: 'Organisation 1' }
          }
        ],
        timestamps: ['2018-09-19T12:05:26.432+03']
      }
    ]
    http.request = jest.fn(() => Promise.resolve({ data }))
    const originalLang = preferences.lang
    preferences.lang = 'en'

    const renderer = create(<Log/>)

    setTimeout(() => {
      const componentJSON = renderer.toJSON()
      expect(componentJSON).toMatchSnapshot()
      renderer.unmount()
      preferences.lang = originalLang

      expect(http.request).toHaveBeenCalledTimes(1)

      done()
    })
  })

  it('should render alert in case of error in query', (done) => {
    http.request = jest.fn(() => {
      const error = new Error('Request failed!')
      return Promise.reject(error)
    })
    console.error = jest.fn()

    const renderer = create(<Log/>)

    setTimeout(() => {
      const componentJSON = renderer.toJSON()
      expect(componentJSON).toMatchSnapshot()
      renderer.unmount()

      expect(http.request).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledTimes(1)

      done()
    })
  })
})
