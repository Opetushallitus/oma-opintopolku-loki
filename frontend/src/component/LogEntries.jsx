import React from 'react'
import { lensProp, map, over, view } from 'ramda'
import Query from 'http/Query'
import { lang } from 'util/preferences'
import { AlertText } from 'ui/typography'
import t from 'util/translate'
import LogEntryGroup from 'component/log-entry-group/LogEntryGroup'

const organizationLens = lensProp('organizations')
const nameLens = lensProp('name')
const oidLens = lensProp('oid')

const getTranslatedName = organizationName => organizationName[lang] || ''

const LogEntries = () => (
  <Query url='logs'>
    {({ data, error, pending }) => {
      if (error) return <AlertText>{t`Tietojen hakemisessa tapahtui virhe.`}</AlertText>
      if (pending) return <div>{t`Tietoja haetaan`}</div>

      const translatedOrganizations = map(over(organizationLens, map(over(nameLens, getTranslatedName))))(data)

      return translatedOrganizations.map(({ organizations, timestamps }) => {
        const key = map(view(oidLens), organizations).join(',')

        return (
          <LogEntryGroup
            key={key}
            organizationAlternatives={organizations}
            timestamps={timestamps}
          />
        )
      })
    }}
  </Query>
)

export default LogEntries
