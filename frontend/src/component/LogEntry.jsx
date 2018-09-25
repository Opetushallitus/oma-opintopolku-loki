import React from 'react'
import PropTypes from 'prop-types'
import Expander from 'component/generic/widget/Expander'
import LogEntryDetails from 'component/LogEntryDetails'

const LogEntry = ({ organizationOid, organizationName }) => (
  <Expander title={organizationName}>
    <LogEntryDetails organizationOid={organizationOid}/>
  </Expander>
)

LogEntry.propTypes = {
  organizationOid: PropTypes.string.isRequired,
  organizationName: PropTypes.string.isRequired
}

export default LogEntry
