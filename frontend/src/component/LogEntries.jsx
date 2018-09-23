import React from 'react'
import Query from '../http/Query'
import LogEntry from './LogEntry'

const LogEntries = () => (
  <Query url='logs'>
    {({ data, error, pending }) => {
      if (error) return <div>{'Oops!'}</div>
      if (pending) return <div>{'Wait!'}</div>

      return data.map(({ timestamp, organizationOid }) =>
        <LogEntry key={timestamp} timestamp={timestamp} organizationOid={organizationOid} />
      )
    }}
  </Query>
)

export default LogEntries
