import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import t from 'util/translate'
import { getTranslatedUsagePermissionDescription, isMydataPartner } from 'util/usagePermissionDescriptions'
import { Bold } from 'ui/typography'
import constants from 'ui/constants'
import media from 'ui/media'
import ExternalLink from 'component/generic/widget/ExternalLink'

const Details = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;

  & > *:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  ${media.full`
    flex-direction: row;

    & > *:not(:last-child) {
      margin-bottom: 0;
    }
  `}
`

const Description = styled.div`
  font-size: ${constants.font.size.s};
`

const weblink = oid => (isMydataPartner(oid)
  ? 'https://confluence.csc.fi/pages/viewpage.action?pageId=76536741'
  : 'https://confluence.csc.fi/pages/viewpage.action?pageId=76541418'
)

const OrganizationDetails = ({ organizationOid }) => (
  <Details>
    <Description>
      <Bold>{t`Tietojen käyttölupa`}:</Bold> {getTranslatedUsagePermissionDescription(organizationOid)}
    </Description>

    <ExternalLink
      text={t`Tarkempi kuvaus lähetetyistä tiedoista`}
      url={weblink(organizationOid)}
      openInNewTab={true}
    />
  </Details>
)

OrganizationDetails.propTypes = {
  organizationOid: PropTypes.string.isRequired
}

export default OrganizationDetails
