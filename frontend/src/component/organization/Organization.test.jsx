import React from 'react'
import renderer, { act } from 'react-test-renderer'
import Organization from './Organization'

describe('Organization', () => {
  const timestamps = ['2018-09-19T12:05:26.432+03', '2018-09-20T16:01:44.543+03']
  const serviceName = 'koski'

  it('should render with organization permitted by default, and expand data when button is clicked', () => {
    const organizations = [{ oid: '1.1.111.111.11.11111111111', name: 'Organisaatio 1' }]
    let root
    act(() => { root = renderer.create(<Organization organizationAlternatives={organizations}
                                                      timestamps={timestamps}
                                                      serviceName={serviceName}/>) })
    expect(root.toJSON()).toMatchSnapshot()

    act(() => { root.root.findAllByType('button')[0].props.onClick() })
    expect(root.toJSON()).toMatchSnapshot()

    root.unmount()
  })

  it('should render with organization permitted by user, and expand data when button is clicked', () => {
    const organizations = [{ oid: '1.2.246.562.10.77876988401', name: 'Organisaatio 2' }]
    let root
    act(() => { root = renderer.create(<Organization organizationAlternatives={organizations}
                                                      timestamps={timestamps}
                                                      serviceName={serviceName} />) })
    expect(root.toJSON()).toMatchSnapshot()

    act(() => { root.root.findAllByType('button')[0].props.onClick() })
    expect(root.toJSON()).toMatchSnapshot()

    root.unmount()
  })
})
