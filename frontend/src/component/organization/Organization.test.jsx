import React from 'react'
import { mount } from 'enzyme'
import Organization from './Organization'

describe('Organization', () => {
  const timestamps = ['2018-09-19T12:05:26.432+03', '2018-09-20T16:01:44.543+03']

  it('should render with organization permitted by default, and expand data when button is clicked', () => {
    const organizations = [{ oid: '1.1.111.111.11.11111111111', name: 'Organisaatio 1' }]
    const wrapper = mount(<Organization organizationAlternatives={organizations} timestamps={timestamps} />)
    expect(wrapper.render()).toMatchSnapshot()

    wrapper.find('button').at(0).simulate('click')
    expect(wrapper.render()).toMatchSnapshot()
  })

  it('should render with organization permitted by user, and expand data when button is clicked', () => {
    const organizations = [{ oid: '1.2.246.562.10.77876988401', name: 'Organisaatio 2' }]
    const wrapper = mount(<Organization organizationAlternatives={organizations} timestamps={timestamps} />)
    expect(wrapper.render()).toMatchSnapshot()

    wrapper.find('button').at(0).simulate('click')
    expect(wrapper.render()).toMatchSnapshot()
  })
})
