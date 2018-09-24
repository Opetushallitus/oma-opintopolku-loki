import React from 'react'
import PropTypes from 'prop-types'

const LogEntry = ({ organizationName }) => <div>{organizationName}</div>

LogEntry.propTypes = {
  organizationName: PropTypes.string
}

export default LogEntry
