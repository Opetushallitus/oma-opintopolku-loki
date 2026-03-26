import React from 'react'
import renderer, { act } from 'react-test-renderer'
import LogEntries from './LogEntries'
import { matchesSnapshot } from 'util/testUtils'

describe('LogEntries', () => {
  const timestamps = ['2018-09-19T12:05:26.432+03', '2018-09-20T16:01:44.543+03']

  // eslint-disable-next-line jest/expect-expect
  it('should render with empty timestamp list', () => {
    matchesSnapshot(<LogEntries timestamps={[]} />)
  })

  it('should render with non-empty timestamp list, and toggle expansion of timestamps when link is clicked', () => {
    let root
    act(() => { root = renderer.create(<LogEntries timestamps={timestamps} />) })
    expect(root.toJSON()).toMatchSnapshot()

    act(() => { root.root.findAllByType('button')[0].props.onClick() })
    expect(root.toJSON()).toMatchSnapshot()

    act(() => { root.root.findAllByType('button')[0].props.onClick() })
    expect(root.toJSON()).toMatchSnapshot()

    root.unmount()
  })

  it('should render with timestamp list of over 10 entries, expanding 10 timestamps at a time', () => {
    const ts = Array(15).fill('2018-09-19T12:05:26.432+03')
    let root
    act(() => { root = renderer.create(<LogEntries timestamps={ts} />) })

    act(() => { root.root.findAllByType('button')[0].props.onClick() })
    expect(root.toJSON()).toMatchSnapshot()

    act(() => { root.root.findAllByType('button')[1].props.onClick() })
    expect(root.toJSON()).toMatchSnapshot()

    root.unmount()
  })
})
