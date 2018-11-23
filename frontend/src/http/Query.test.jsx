import React from 'react'
import Query from './Query'
import { matchesSnapshot } from 'util/testUtils'

describe('Query', () => {
  it('should render alert defined by ErrorBoundary when query fails', () => {
    console.warn = jest.fn()
    console.error = jest.fn()
    matchesSnapshot(<Query/>) // this fails because url is not given, among other reasons
  })
})
