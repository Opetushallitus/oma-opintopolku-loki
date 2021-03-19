import React from 'react'
import { mount } from 'enzyme'
import LogEntries from './LogEntries'
import { matchesSnapshot } from 'util/testUtils'

describe('LogEntries', () => {
  const timestamps = ['2018-09-19T12:05:26.432+03', '2018-09-20T16:01:44.543+03']

  // eslint-disable-next-line jest/expect-expect
  it('should render with empty timestamp list', () => {
    matchesSnapshot(<LogEntries timestamps={[]} />)
  })

  it('should render with non-empty timestamp list, and toggle expansion of timestamps when link is clicked', () => {
    const wrapper = mount(<LogEntries timestamps={timestamps} />)
    expect(wrapper.render()).toMatchSnapshot()

    wrapper.find('button').at(0).simulate('click')
    expect(wrapper.render()).toMatchSnapshot()

    wrapper.find('button').at(0).simulate('click')
    expect(wrapper.render()).toMatchSnapshot()
  })

  it('should render with timestamp list of over 10 entries, expanding 10 timestamps at a time', () => {
    const ts = Array(15).fill('2018-09-19T12:05:26.432+03')
    const wrapper = mount(<LogEntries timestamps={ts} />)

    wrapper.find('button').at(0).simulate('click')
    expect(wrapper.render()).toMatchSnapshot()

    wrapper.find('button').at(1).simulate('click')
    expect(wrapper.render()).toMatchSnapshot()
  })
})
