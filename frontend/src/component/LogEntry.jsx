import React from 'react'
import PropTypes from 'prop-types'
import Expander from 'component/generic/widget/Expander'
import LogEntryDetails from 'component/LogEntryDetails'

const LogEntry = ({ organizationName }) => (
  <Expander title={organizationName}>
    <LogEntryDetails/>
  </Expander>
)

LogEntry.propTypes = {
  organizationName: PropTypes.string.isRequired
}

export default LogEntry
