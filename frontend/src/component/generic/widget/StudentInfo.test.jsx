import React from 'react'
import StudentInfo, { Birthday, Name } from './StudentInfo'
import { create } from 'react-test-renderer'
import http from '../../../http/http'

describe('StudentInfo', () => {
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

    const renderer = create(<StudentInfo/>)

    setTimeout(() => {
      expect(renderer.root.findByType(Name).props.children).toEqual('Onni Oskari Oppija')
      expect(renderer.root.findByType(Birthday).props.children.join('')).toEqual(' s. 1.2.1980')

      const componentJSON = renderer.toJSON()
      expect(componentJSON).toMatchSnapshot()
      renderer.unmount()

      expect(http.request).toHaveBeenCalledTimes(1)

      done()
    })
  })

  it('parses birthdate correctly', (done) => {
    http.request = jest.fn(() =>
      Promise.resolve({
        data: {
          etunimet: 'Onni Oskari',
          sukunimi: 'Oppija',
          hetu: '010203AABC1'
        }
      })
    )

    const renderer = create(<StudentInfo/>)

    setTimeout(() => {
      expect(renderer.root.findByType(Name).props.children).toEqual('Onni Oskari Oppija')
      expect(renderer.root.findByType(Birthday).props.children.join('')).toEqual(' s. 1.2.2003')
      expect(renderer.root.findAllByType('span')).toHaveLength(2)

      renderer.unmount()

      expect(http.request).toHaveBeenCalledTimes(1)

      done()
    })
  })

  it('parses really old birthdate correctly', (done) => {
    http.request = jest.fn(() =>
      Promise.resolve({
        data: {
          etunimet: 'Onni Oskari',
          sukunimi: 'Oppija',
          hetu: '010299+ABC1'
        }
      })
    )

    const renderer = create(<StudentInfo/>)

    setTimeout(() => {
      expect(renderer.root.findByType(Name).props.children).toEqual('Onni Oskari Oppija')
      expect(renderer.root.findByType(Birthday).props.children.join('')).toEqual(' s. 1.2.1899')
      expect(renderer.root.findAllByType('span')).toHaveLength(2)

      renderer.unmount()

      expect(http.request).toHaveBeenCalledTimes(1)

      done()
    })
  })

  it('handles invalid hetu correctly', (done) => {
    http.request = jest.fn(() =>
      Promise.resolve({
        data: {
          etunimet: 'Onni Oskari',
          sukunimi: 'Oppija',
          hetu: 'foobar'
        }
      })
    )
    console.log = jest.fn()

    const renderer = create(<StudentInfo/>)

    setTimeout(() => {
      expect(renderer.root.findByType(Name).props.children).toEqual('Onni Oskari Oppija')
      expect(renderer.root.findAllByType('span')).toHaveLength(1)

      renderer.unmount()

      expect(console.log).toHaveBeenCalledTimes(3)

      done()
    })
  })
})
