import React from 'react'
import { lensProp, map, over, view } from 'ramda'
import Query from 'http/Query'
import { lang } from 'util/preferences'
import { AlertText } from 'ui/typography'
import constants from 'ui/constants'
import t from 'util/translate'
import Organization from 'component/organization/Organization'
import styled from 'styled-components'

const organizationLens = lensProp('organizations')
const nameLens = lensProp('name')
const oidLens = lensProp('oid')

const NotificationText = styled.div`
  margin: 4.429rem 0;
  font-size: ${constants.font.size.xl};
  letter-spacing: 0.0214rem;
`

const getTranslatedName = organizationName => organizationName[lang] || ''

const Log = () => (
  <Query url='auditlog'>
    {({ data, error, pending }) => {
      if (error) return <AlertText>{t`Tapahtui odottamaton virhe, emmekä juuri nyt pysty näyttämään tietoja.`}</AlertText>
      if (pending) return <div>{t`Tietoja haetaan`}</div>
      if (!Array.isArray(data) || !data.length) return <NotificationText>{t`Sivu on tyhjä, koska tietojasi ei ole vielä käytetty`}</NotificationText>

      const translatedOrganizations = map(over(organizationLens, map(over(nameLens, getTranslatedName))))(data)

      return translatedOrganizations.map(({ organizations, timestamps }) => {
        const key = map(view(oidLens), organizations).join(',')

        return (
          <Organization
            key={key}
            organizationAlternatives={organizations}
            timestamps={timestamps}
          />
        )
      })
    }}
  </Query>
)

export default Log
