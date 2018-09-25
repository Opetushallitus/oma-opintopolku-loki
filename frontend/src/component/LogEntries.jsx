import React from 'react'
import { lensProp, omit, over, uniq } from 'ramda'
import Query from 'http/Query'
import LogEntry from 'component/LogEntry'
import { lang } from 'util/preferences'
import { AlertText } from '../ui/typography'
import t from 'util/translate'

const getTranslatedName = organizationName => organizationName[lang] || ''
const nameLens = lensProp('organizationName')

const LogEntries = () => (
  <Query url='logs'>
    {({ data, error, pending }) => {
      if (error) return <AlertText>{t`Tietojen hakemisessa tapahtui virhe.`}</AlertText>
      if (pending) return <div>{t`Tietoja haetaan`}</div>

      const organizations = uniq(data
        .map(omit(['timestamp']))
        .map(over(nameLens, getTranslatedName)))

      return organizations.map(({ organizationOid, organizationName }) =>
        <LogEntry
          key={organizationOid}
          organizationOid={organizationOid}
          organizationName={organizationName}
        />
      )
    }}
  </Query>
)

export default LogEntries
