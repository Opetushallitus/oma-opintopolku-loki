import React from 'react'
import ExternalLink from './ExternalLink'
import { matchesSnapshot } from 'util/testUtils'

describe('ExternalLink', () => {
  it('should render external link', () => {
    matchesSnapshot(<ExternalLink
      text={'Teksti'}
      url={'http://localhost'}
    />)
  })

  it('should render external link that targets new tab', () => {
    matchesSnapshot(<ExternalLink
      text={'Teksti'}
      url={'http://localhost'}
      openInNewTab={true}
    />)
  })

  it('should render link without explicit text', () => {
    matchesSnapshot(<ExternalLink
      url={'http://localhost'}
    />)
  })
})
