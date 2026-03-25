import React from 'react'
import PropTypes from 'prop-types'
import { lensProp, map, view } from 'ramda'
import styled from 'styled-components'
import Organization from 'component/organization/Organization'
import OrganizationsHeader from 'component/organization/OrganizationsHeader'
import { H3 } from 'ui/typography'

const oidLens = lensProp('oid')

const SectionTitle = styled(H3)`
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
`

const renderOrganization = ({ organizations, timestamps, serviceName, isMyDataUse, isJakolinkkiUse }) => {
  const key = map(view(oidLens), organizations).join(',') + serviceName + isMyDataUse + isJakolinkkiUse

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
}

const Organizations = ({ translatedOrganizations }) => {
  const myDataEntries = translatedOrganizations.filter(e => e.isMyDataUse || e.isJakolinkkiUse)
  const otherEntries = translatedOrganizations.filter(e => !e.isMyDataUse && !e.isJakolinkkiUse)

  return (
    <React.Fragment>
      <OrganizationsHeader/>

      {myDataEntries.length > 0 && (
        <React.Fragment>
          <SectionTitle>Annetut käyttöluvat</SectionTitle>
          {myDataEntries.map(renderOrganization)}
        </React.Fragment>
      )}

      {otherEntries.length > 0 && (
        <React.Fragment>
          <SectionTitle>Lakiin perustuvat tietojen käyttäjät</SectionTitle>
          {otherEntries.map(renderOrganization)}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

Organizations.propTypes = {
  translatedOrganizations: PropTypes.array.isRequired
}

export default Organizations
