import React from 'react'
import PropTypes from 'prop-types'
import { lensPath, view } from 'ramda'
import Expander from 'component/generic/widget/Expander'
import LogEntryDetails from 'component/LogEntryDetails'

/*
TODO: Currently we just take the first organization alternative (its name and oid). This must be changed.
 */
const nameLens = lensPath(['0', 'name'])
const oidLens = lensPath(['0', 'oid'])

const title = organizations => view(nameLens, organizations)

const LogEntry = ({ organizations, timestamps }) => (
  <Expander title={title(organizations)}>
    <LogEntryDetails organizationOid={view(oidLens, organizations)} timestamps={timestamps} />
  </Expander>
)

LogEntry.propTypes = {
  organizations: PropTypes.array.isRequired,
  timestamps: PropTypes.array.isRequired
}

export default LogEntry
