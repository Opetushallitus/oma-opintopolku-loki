import React from 'react'
import { uniq } from 'ramda'
import Query from '../http/Query'
import LogEntry from './LogEntry'
import { lang } from '../util/preferences'

const getTranslatedName = organizationName => organizationName[lang] || ''

const LogEntries = () => (
  <Query url='logs'>
    {({ data, error, pending }) => {
      if (error) return <div>{'Oops!'}</div>
      if (pending) return <div>{'Wait!'}</div>

      return (
        <Query
          url={`${process.env.ORGANISAATIO_SERVICE_BASE_URL}/organisaatio/v4/findbyoids`}
          method='post'
          body={uniq(data.map(v => v.organizationOid))}
        >
          {({ data, error, pending }) => {
            if (error) return <div>{'Oops!'}</div>
            if (pending) return <div>{'Wait!'}</div>

            return data.map(({ nimi }) => {
              const name = getTranslatedName(nimi)
              return <LogEntry key={name} organizationName={name} />
            })
          }}
        </Query>
      )
    }}
  </Query>
)

export default LogEntries
