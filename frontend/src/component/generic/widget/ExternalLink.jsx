import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import ExternalLinkIcon from 'icon/external-link-icon.svg'
import { Link } from '../../../ui/typography'

const PositionedLinkIcon = styled(ExternalLinkIcon)`
  padding-right: 0.25rem;
  position: relative;
  top: 2px;
`

const ExternalLink = ({ text, url, openInNewTab = false }) => (
  <Link target={openInNewTab ? '_blank' : undefined} href={url}>
    <PositionedLinkIcon/>
    {text || url }
  </Link>
)

ExternalLink.propTypes = {
  text: PropTypes.string,
  url: PropTypes.string.isRequired,
  openInNewTab: PropTypes.bool
}

export default ExternalLink
