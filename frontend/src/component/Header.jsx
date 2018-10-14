import React from 'react'
import { H1, Lead } from 'ui/typography'
import t from 'util/translate'
import NavBar from 'component/generic/widget/NavBar'

const Header = () => (
  <header>
    <H1>
      {t`Tietojeni käyttö`}
    </H1>
    <Lead>
      {t`Tällä sivulla voit tarkastella ja hallinnoida antamiasi käyttölupia tietoihisi. Lisäksi näet mitkä tahot, esim. viranomaiset, ovat katsoneet opintotietojasi.`}
    </Lead>
    <NavBar />
  </header>
)

export default Header
