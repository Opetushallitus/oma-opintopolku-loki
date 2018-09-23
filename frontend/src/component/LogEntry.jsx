import React from 'react'
import PropTypes from 'prop-types'

const LogEntry = ({ timestamp, organizationOid }) => (
  <div>
    {timestamp} {organizationOid}
  </div>
)

LogEntry.propTypes = {
  timestamp: PropTypes.string,
  organizationOid: PropTypes.string
}

export default LogEntry
