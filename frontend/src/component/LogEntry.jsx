import React from 'react'
import PropTypes from 'prop-types'
import Expander from 'component/generic/widget/Expander'

const LogEntry = ({ organizationName }) => (
  <Expander title={organizationName}>
    <div>{'contents'}</div>
  </Expander>
)

LogEntry.propTypes = {
  organizationName: PropTypes.string.isRequired
}

export default LogEntry
