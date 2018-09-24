import React from 'react'
import styled from 'styled-components'
import t from 'util/translate'
import ExternalLink from './generic/widget/ExternalLink'
import { Bold } from '../ui/typography'

const Details = styled.div`
  display: flex;
  justify-content: space-between;
`

const LogEntryDetails = () => (
  <Details>
    <div>
      <Bold>{t`Tietojen käyttölupa`}:</Bold>
    </div>

    <ExternalLink text={t`Taulukko tietojen käyttökerroista`} url='' />
  </Details>
)

export default LogEntryDetails
