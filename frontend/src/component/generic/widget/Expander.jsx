import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import constants from 'ui/constants'
import media from 'ui/media'
import t from 'util/translate'

const ExpanderContainer = styled.div`
  background-color: ${constants.color.background.neutralLight};

  &:not(:last-of-type) {
    margin-bottom: 0.5rem;
  }
`

const ExpanderPrefix = styled.div`
  margin-left: 0.375rem;
  font-family: monospace;
`

const ExpanderTitle = styled.button`
  display: flex;
  width: 100%;
  background-color: ${({ expanded }) => expanded
    ? constants.color.primaryLight
    : constants.color.background.primaryTintedLight};
  padding: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  text-align: left;
  border: none;
  gap: 0.5rem;
`

const ExpanderSuffix = styled.div`
  margin-left: auto;
  margin-right: 0.375rem;
  text-align: right;
`

const ExpandedContents = styled.div`
  padding: 1rem 1.5rem;

  ${media.full`
    padding: 1.5rem 2.5rem;
  `}
`

const Expander = ({ title, serviceName, children }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <ExpanderContainer>
      <ExpanderTitle
        expanded={expanded}
        onClick={() => setExpanded(v => !v)}
        aria-pressed={expanded}
      >
        <ExpanderPrefix aria-hidden={'true'}>{expanded ? '-' : '+'}</ExpanderPrefix>
        {title}
        <ExpanderSuffix>
          {serviceName === 'varda'
            ? t('Varhaiskasvatuksen tietovaranto (Varda)')
            : t('Opintosuoritukset (KOSKI)')}
        </ExpanderSuffix>
      </ExpanderTitle>
      {expanded && <ExpandedContents>{children}</ExpandedContents>}
    </ExpanderContainer>
  )
}

Expander.propTypes = {
  title: PropTypes.string.isRequired,
  serviceName: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default Expander
