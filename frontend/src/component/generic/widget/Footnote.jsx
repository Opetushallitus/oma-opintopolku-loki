import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import constants from 'ui/constants'
import t from 'util/translate'

const Container = styled.div`
  font-size: ${constants.font.size.s};
  color: ${constants.color.gray};
  margin: 1rem 0;
`

const Footnote = ({ text }) => <Container>{`* = ${t(text)}`}</Container>

Footnote.propTypes = {
  text: PropTypes.string.isRequired
}

export default Footnote
