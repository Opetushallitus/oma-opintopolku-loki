import React from 'react'
import { H1, Lead } from 'ui/typography'
import t from 'util/translate'
import StudentInfo from 'component/generic/widget/StudentInfo'
import NavBar from 'component/generic/widget/NavBar'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Description = styled(Lead)`
    margin-top: 2.429rem;
    margin-bottom: 2.429rem;
`

const Header = ({ selectedHetu, onSelectHetu }) => (
  <header>
    <H1>
      {t`Tietojeni käyttö`}
    </H1>
    <Description>
      <p>{t`Tällä sivulla voit tarkastella ja hallinnoida antamiasi käyttölupia tietoihisi. Lisäksi näet mitkä toimijat, esim. viranomaiset, ovat käyttäneet tietojasi.`}{'*'}</p>
      <p>{t`Tietoja käyttäneissä toimijoissa on listattuna kaikki ne kerrat, kun tietojasi on katsottu tai niitä on haettu toiseen järjestelmään automatisoidusti. Tietojasi voivat hakea automaattisesti Opetushallituksen eri järjestelmät, viranomaiset tai ne kolmannet osapuolet, joille olet erikseen antanut luvan hyödyntää tietojasi Oma Opintopolusta. Opetushallituksen ja viranomaisten automaattiset haut tapahtuvat yleensä ruuhka-aikojen ulkopuolella, lähinnä ilta- tai yöaikaan.`}</p>
    </Description>

    <StudentInfo selectedHetu={selectedHetu} onSelectHetu={onSelectHetu}/>
    <NavBar />
  </header>
)
Header.propTypes = ({
  selectedHetu: PropTypes.string,
  onSelectHetu: PropTypes.func
})

export default Header
