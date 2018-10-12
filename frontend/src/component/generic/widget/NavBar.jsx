import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import constants from 'ui/constants'

const Navigation = styled.div`
  margin-bottom: 27px;
  border-style: none none solid none;
  border-width: 1px;
  border-color: #149ecb;
`

const Tab = styled.span`
  display: inline-block;
  font-size: ${constants.font.size.l};
  padding: 0.5rem 5rem;
`

const InactiveTab = styled(Tab)`
  font-weight: 600;
  background-color: #f5f5f5;
`

const ActiveTab = styled(Tab)`
  border-color: #149ecb #979797 white #979797;
  border-style: solid solid none solid;
  border-width: 2px 1px 0px 1px;
`

const NavBar = () => (
  <Navigation>
    <InactiveTab>Annetut käyttöluvat</InactiveTab>
    <ActiveTab>Tietojani käyttäneet toimijat</ActiveTab>
  </Navigation>
)

export default NavBar
