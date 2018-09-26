import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import t from 'util/translate'
import ExternalLink from './generic/widget/ExternalLink'
import { Bold } from '../ui/typography'
import { getTranslatedUsagePermissionDescription } from '../util/usagePermissionDescriptions'

const Details = styled.div`
  display: flex;
  justify-content: space-between;
`

const LogEntryDetails = ({ organizationOid, timestamps }) => (
  <Details>
    <div>
      <Bold>{t`Tietojen käyttölupa`}:</Bold> {getTranslatedUsagePermissionDescription(organizationOid)}
    </div>

    <ExternalLink text={t`Taulukko tietojen käyttökerroista`} url='' />
  </Details>
)

LogEntryDetails.propTypes = {
  organizationOid: PropTypes.string.isRequired,
  timestamps: PropTypes.array.isRequired
}

export default LogEntryDetails
