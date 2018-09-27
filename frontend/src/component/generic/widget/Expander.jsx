import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import constants from 'ui/constants'

const ExpanderContainer = styled.div`
  &:not(:last-of-type) {
    margin-bottom: 0.5rem;
  }
`

const ExpanderTitle = styled.div`
  background-color: ${({ expanded }) => expanded
    ? constants.color.primaryLight
    : constants.color.background.primaryTintedLight};
  padding: 0.25rem;
  cursor: pointer;
`

const ExpandedContents = styled.div`
  padding: 1.5rem 2.5rem;
`

class Expander extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      expanded: false
    }
  }

  toggleShowContents () {
    this.setState(({ expanded }) => ({ expanded: !expanded }))
  }

  render () {
    const { expanded } = this.state
    const { title, children } = this.props

    return (
      <ExpanderContainer>
        <ExpanderTitle
          expanded={expanded}
          onClick={this.toggleShowContents.bind(this)}
        >
          {title}
        </ExpanderTitle>
        {expanded && <ExpandedContents>{children}</ExpandedContents>}
      </ExpanderContainer>
    )
  }
}

Expander.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired
}

export default Expander
