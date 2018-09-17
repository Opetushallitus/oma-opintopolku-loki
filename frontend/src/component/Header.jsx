import React from 'react'
import { H1, Lead } from '../ui/elements'
import t from '../util/translate'

const Header = () => (
  <header>
    <H1>
      {t('Oma Opintopolku -loki')}
    </H1>
    <Lead>
      {t('Tällä sivulla voit tarkastella ja hallinnoida antamiasi käyttölupia tietoihisi. Lisäksi näet mitkä tahot, esim. viranomaiset, ovat katsoneet opintotietojasi.')}
    </Lead>
  </header>
)

export default Header
