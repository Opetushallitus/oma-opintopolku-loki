import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import constants from 'ui/constants'
import media from 'ui/media'
import t from 'util/translate'

const Navigation = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
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
  background-color: ${constants.color.background.neutralLight};
  border-bottom: 1px solid ${constants.color.primary};
`

const ActiveTab = styled(Tab)`
  border-color: ${constants.color.primary} ${constants.color.border} ${constants.color.white} ${constants.color.border};
  border-style: solid solid none solid;
  border-width: 2px 1px 0px 1px;
`

const Filler = styled.span`
  flex: 1;
  border-bottom: 1px solid ${constants.color.primary};
`

const Link = ({ className, children, href }) => (
  <a href={href} className={className}>
    {children}
  </a>
)

const StyledLink = styled(Link)`
  color: ${constants.color.black};
`

const NavBar = () => (
  <Navigation>
    <StyledLink href={'/koski/omadata/kayttooikeudet'}>
      <InactiveTab>{t`Annetut käyttöluvat`}</InactiveTab>
    </StyledLink>
    <ActiveTab>{t`Tietojani käyttäneet toimijat`}</ActiveTab>
    <Filler />
  </Navigation>
)

Link.propTypes = {
  href: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default NavBar
