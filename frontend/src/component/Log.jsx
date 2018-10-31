import React from 'react'
import { lensProp, map, over } from 'ramda'
import Query from 'http/Query'
import { lang } from 'util/preferences'
import { AlertText } from 'ui/typography'
import constants from 'ui/constants'
import t from 'util/translate'
import Organizations from 'component/organization/Organizations'
import styled from 'styled-components'
import Footnote from './generic/widget/Footnote'

const organizationLens = lensProp('organizations')
const nameLens = lensProp('name')

const NotificationText = styled.div`
  margin: 4.429rem 0;
  font-size: ${constants.font.size.xl};
  letter-spacing: 0.0214rem;
`

const getTranslatedName = organizationName => organizationName[lang] || ''

const NoEntries = () => (
  <div>
    <NotificationText>{`${t('Sivu on tyhjä, koska tietojasi ei ole vielä käytetty')}*`}</NotificationText>
    <Footnote text={'Tietojen käyttäjät näytetään 1.10.2018 jälkeiseltä ajalta. --ei-katsomisia'}/>
  </div>
)

const Log = () => (
  <Query url='auditlog'>
    {({ data, error, pending }) => {
      if (error) return <AlertText>{t`Tapahtui odottamaton virhe, emmekä juuri nyt pysty näyttämään tietoja.`}</AlertText>
      if (pending) return <div>{t`Tietoja haetaan`}</div>
      if (!Array.isArray(data) || !data.length) return <NoEntries/>

      const translatedOrganizations = map(over(organizationLens, map(over(nameLens, getTranslatedName))))(data)
      return <Organizations translatedOrganizations={translatedOrganizations}/>
    }}
  </Query>
)

export default Log
