import React from 'react'
import PropTypes from 'prop-types'
import { lensProp, map, view } from 'ramda'
import Organization from 'component/organization/Organization'
import OrganizationsHeader from 'component/organization/OrganizationsHeader'

const oidLens = lensProp('oid')

const Organizations = ({ translatedOrganizations }) => (
  <React.Fragment>
    <OrganizationsHeader/>

    {
      translatedOrganizations.map(({ organizations, timestamps, serviceName, isMyDataUse, isJakolinkkiUse }) => {
        const key = map(view(oidLens), organizations).join(',')

        return (
          <Organization
            key={key}
            organizationAlternatives={organizations}
            timestamps={timestamps}
            serviceName={serviceName}
            isMyDataUse={isMyDataUse}
            isJakolinkkiUse={isJakolinkkiUse}
          />
        )
      })
    }

  </React.Fragment>
)

Organizations.propTypes = {
  translatedOrganizations: PropTypes.array.isRequired
}

export default Organizations
