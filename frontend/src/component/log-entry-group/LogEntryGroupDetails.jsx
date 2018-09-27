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

const LogEntryGroupDetails = ({ organizationOid, timestamps }) => (
  <Details>
    <div>
      <Bold>{t`Tietojen käyttölupa`}:</Bold> {getTranslatedUsagePermissionDescription(organizationOid)}
    </div>

    <ExternalLink text={t`Taulukko tietojen käyttökerroista`} url='' />
  </Details>
)

LogEntryGroupDetails.propTypes = {
  organizationOid: PropTypes.string.isRequired,
  timestamps: PropTypes.array.isRequired
}

export default LogEntryGroupDetails
