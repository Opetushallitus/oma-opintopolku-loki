import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import t from 'util/translate'
import { getTranslatedUsagePermissionDescription } from 'util/usagePermissionDescriptions'
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

const weblink = isMyDataUse => (isMyDataUse
  ? t('omadata-link')
  : t('tietosuojaseloste-link')
)

const OrganizationDetails = ({ isMyDataUse }) => (
  <Details>
    <Description>
      <Bold>{t`Tietojen käyttölupa`}:</Bold> {getTranslatedUsagePermissionDescription(isMyDataUse)}
    </Description>

    <ExternalLink
      text={t`Tarkempi kuvaus lähetetyistä tiedoista`}
      url={weblink(isMyDataUse)}
      openInNewTab={true}
    />
  </Details>
)

OrganizationDetails.propTypes = {
  isMyDataUse: PropTypes.bool,
  isJakolinkkiUse: PropTypes.bool
}

export default OrganizationDetails
