import React from 'react'
import PropTypes from 'prop-types'
import { lensPath, view } from 'ramda'
import Expander from 'component/generic/widget/Expander'
import OrganizationDetails from 'component/organization/OrganizationDetails'
import LogEntries from 'component/log-entries/LogEntries'

/*
TODO: Currently we just take the first organization alternative (its name and oid). This must be changed.
 */
const nameLens = lensPath(['0', 'name'])
const oidLens = lensPath(['0', 'oid'])

const title = organizations => view(nameLens, organizations)

const Organization = ({ organizationAlternatives, timestamps }) => (
  <Expander title={title(organizationAlternatives)}>
    <OrganizationDetails organizationOid={view(oidLens, organizationAlternatives)} />
    <LogEntries timestamps={timestamps}/>
  </Expander>
)

Organization.propTypes = {
  organizationAlternatives: PropTypes.array.isRequired,
  timestamps: PropTypes.array.isRequired
}

export default Organization
