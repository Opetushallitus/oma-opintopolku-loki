import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import constants from 'ui/constants'
import media from 'ui/media'

const Navigation = styled.div`
  display: flex;
  margin-bottom: 27px;
`

const Tab = styled.span`
  display: inline-block;
  font-size: ${constants.font.size.base};
  padding: 0.5rem 2rem;
  
  ${media.full`
    padding: 0.5rem 5rem;
  `}
`

const InactiveTab = styled(Tab)`
  font-weight: 600;
  background-color: #f5f5f5;
  border-bottom: 1px solid #149ecb;
  
  a:link {
    color: red;
  }
  a:visited {
    color: green;
  }
`

const ActiveTab = styled(Tab)`
  border-color: #149ecb #979797 white #979797;
  border-style: solid solid none solid;
  border-width: 2px 1px 0px 1px;
`

const Filler = styled.span`
  flex: 1;
  border-bottom: 1px solid #149ecb;
`

const Link = ({ className, children, href }) => (
  <a href={href} className={className}>
    {children}
  </a>
);

const StyledLink = styled(Link)`
  color: #000000;
`;

const NavBar = () => (
  <Navigation>
    <StyledLink href={'/koski/omadata/kayttooikeudet'}>
      <InactiveTab>Annetut käyttöluvat</InactiveTab>
    </StyledLink>
    <ActiveTab>Tietojani käyttäneet toimijat</ActiveTab>
    <Filler />
  </Navigation>
)

export default NavBar
