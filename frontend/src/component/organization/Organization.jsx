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

const title = organizations => view(nameLens, organizations)

const Organization = ({ organizationAlternatives, timestamps, serviceName, isMyDataUse, isJakolinkkiUse }) => (
  <Expander title={title(organizationAlternatives)} serviceName={serviceName}>
    <OrganizationDetails isMyDataUse={isMyDataUse} isJakolinkkiUse={isJakolinkkiUse}/>
    <LogEntries timestamps={timestamps}/>
  </Expander>
)

Organization.propTypes = {
  organizationAlternatives: PropTypes.array.isRequired,
  timestamps: PropTypes.array.isRequired,
  serviceName: PropTypes.string.isRequired,
  isMyDataUse: PropTypes.bool,
  isJakolinkkiUse: PropTypes.bool
}

export default Organization
