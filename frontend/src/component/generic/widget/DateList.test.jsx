import React from 'react'
import DateList from './DateList'
import { matchesSnapshot } from 'util/testUtils'

describe('DateList', () => {
  it('should be rendered', () => {
    matchesSnapshot(<DateList dates={['1.1.2018']}/>)
  })
})
