import React from 'react'
import styled from 'styled-components'
import constants from 'ui/constants'
import media from 'ui/media'
import t from 'util/translate'

const Navigation = styled.div`
  display: flex;
  margin-bottom: 1.714rem;
`

const Tab = styled.span`
  display: inline-block;
  padding: 0.5rem 2rem;
  
  ${media.full`
    padding: 0.5rem 5rem;
  `}
`

const InactiveTab = styled(Tab)`
  box-sizing: border-box;
  height: 100%;
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

const Link = styled.a`
  color: ${constants.color.black};
`

const NavBar = () => (
  <Navigation>
    <Link href={'/koski/omadata/kayttooikeudet'}>
      <InactiveTab>{t`Annetut käyttöluvat`}</InactiveTab>
    </Link>
    <ActiveTab>{t`Tietojani käyttäneet toimijat`}</ActiveTab>
    <Filler />
  </Navigation>
)

export default NavBar
