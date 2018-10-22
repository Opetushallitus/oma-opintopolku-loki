import React from 'react'
import { H1, Lead } from 'ui/typography'
import t from 'util/translate'
import StudentInfo from 'component/generic/widget/StudentInfo'
import NavBar from 'component/generic/widget/NavBar'
import styled from 'styled-components'

const Description = styled(Lead)`
    margin-top: 2.429rem;
    margin-bottom: 2.429rem;
`

const Header = () => (
  <header>
    <H1>
      {t`Tietojeni käyttö`}
    </H1>
    <Description>
      {t`Tällä sivulla voit tarkastella ja hallinnoida antamiasi käyttölupia tietoihisi. Lisäksi näet mitkä tahot, esim. viranomaiset, ovat katsoneet opintotietojasi.`}
    </Description>
    <StudentInfo/>
    <NavBar />
  </header>
)

export default Header
