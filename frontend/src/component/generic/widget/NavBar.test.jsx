import React from 'react'
import NavBar from './NavBar'
import { matchesSnapshot } from 'util/testUtils'

describe('NavBar', () => {
  it('should be rendered', () => {
    matchesSnapshot(<NavBar/>)
  })
})
