import React from 'react'
import { lensProp, map, view } from 'ramda'
import Organization from 'component/organization/Organization'

const oidLens = lensProp('oid')

const Organizations = ({ translatedOrganizations }) => translatedOrganizations.map(({ organizations, timestamps }) => {
  const key = map(view(oidLens), organizations).join(',')

  return (
    <Organization
      key={key}
      organizationAlternatives={organizations}
      timestamps={timestamps}
    />
  )
})

export default Organizations
