import React from 'react'
import { lensProp, omit, over, uniq } from 'ramda'
import Query from 'http/Query'
import LogEntry from 'component/LogEntry'
import { lang } from 'util/preferences'

const getTranslatedName = organizationName => organizationName[lang] || ''
const nameLens = lensProp('organizationName')

const LogEntries = () => (
  <Query url='logs'>
    {({ data, error, pending }) => {
      if (error) return <div>{'Oops!'}</div>
      if (pending) return <div>{'Wait!'}</div>

      const organizations = uniq(data
        .map(omit(['timestamp']))
        .map(over(nameLens, getTranslatedName)))

      return organizations.map(({ organizationOid, organizationName }) =>
        <LogEntry key={organizationOid} organizationName={organizationName} />
      )
    }}
  </Query>
)

export default LogEntries
