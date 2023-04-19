import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import constants from 'ui/constants'

const Container = styled.div`
  font-size: ${constants.font.size.s};
  color: ${constants.color.gray};
  margin: 1rem 0;
  display: flex;
`
const TextContainer = styled.div`
  margin-left: 0.25rem;
`

const Footnote = ({ children, stars }) => (
  <Container>
    {'*'.repeat(stars)}
    <TextContainer>{children}</TextContainer>
  </Container>
)

Footnote.propTypes = {
  children: PropTypes.node.isRequired,
  stars: PropTypes.number
}

Footnote.defaultProps = {
  stars: 1
}

export default Footnote
