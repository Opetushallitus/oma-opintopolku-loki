import React from 'react'
import PropTypes from 'prop-types'
import Expander from 'component/generic/widget/Expander'
import OrganizationDetails from 'component/organization/OrganizationDetails'
import LogEntries from 'component/log-entries/LogEntries'
import t from 'util/translate'

const title = organizations =>
  organizations.length > 0
    ? organizations.map(org => org.name).join(', ')
    : t('Opintosuorituksista tehdyn jakolinkin tuntematon käyttäjä')

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
