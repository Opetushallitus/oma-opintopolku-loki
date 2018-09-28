import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import t from 'util/translate'
import { getTranslatedUsagePermissionDescription } from 'util/usagePermissionDescriptions'
import { Bold } from 'ui/typography'
import ExternalLink from 'component/generic/widget/ExternalLink'

const Details = styled.div`
  display: flex;
  justify-content: space-between;
`

const OrganizationDetails = ({ organizationOid }) => (
  <Details>
    <div>
      <Bold>{t`Tietojen käyttölupa`}:</Bold> {getTranslatedUsagePermissionDescription(organizationOid)}
    </div>

    <ExternalLink
      text={t`Tarkempi kuvaus lähetetyistä tiedoista`}
      url='https://confluence.csc.fi/pages/viewpage.action?pageId=76536741'
      openInNewTab={true}
    />
  </Details>
)

OrganizationDetails.propTypes = {
  organizationOid: PropTypes.string.isRequired
}

export default OrganizationDetails
