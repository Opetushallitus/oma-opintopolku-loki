import React from 'react'
import NavBar from './NavBar'
import { matchesSnapshot } from 'util/testUtils'

describe('NavBar', () => {
  // eslint-disable-next-line jest/expect-expect
  it('should be rendered', () => {
    matchesSnapshot(<NavBar/>)
  })
})
