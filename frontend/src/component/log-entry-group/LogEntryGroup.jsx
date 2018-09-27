import React from 'react'
import PropTypes from 'prop-types'
import { lensPath, view } from 'ramda'
import Expander from 'component/generic/widget/Expander'
import LogEntryGroupDetails from 'component/log-entry-group/LogEntryGroupDetails'
import Timestamps from 'component/timestamp/Timestamps'

/*
TODO: Currently we just take the first organization alternative (its name and oid). This must be changed.
 */
const nameLens = lensPath(['0', 'name'])
const oidLens = lensPath(['0', 'oid'])

const title = organizations => view(nameLens, organizations)

const LogEntryGroup = ({ organizationAlternatives, timestamps }) => (
  <Expander title={title(organizationAlternatives)}>
    <LogEntryGroupDetails organizationOid={view(oidLens, organizationAlternatives)} />
    <Timestamps timestamps={timestamps}/>
  </Expander>
)

LogEntryGroup.propTypes = {
  organizationAlternatives: PropTypes.array.isRequired,
  timestamps: PropTypes.array.isRequired
}

export default LogEntryGroup
