import React from 'react'
import ExternalLink from './ExternalLink'
import { matchesSnapshot } from 'util/testUtils'

describe('ExternalLink', () => {
  // eslint-disable-next-line jest/expect-expect
  it('should render external link', () => {
    matchesSnapshot(<ExternalLink
      text={'Teksti'}
      url={'http://localhost'}
    />)
  })

  // eslint-disable-next-line jest/expect-expect
  it('should render external link that targets new tab', () => {
    matchesSnapshot(<ExternalLink
      text={'Teksti'}
      url={'http://localhost'}
      openInNewTab={true}
    />)
  })

  // eslint-disable-next-line jest/expect-expect
  it('should render link without explicit text', () => {
    matchesSnapshot(<ExternalLink
      url={'http://localhost'}
    />)
  })
})
