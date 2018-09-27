import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const TextButton = styled.button`
  display: inline-block;
  border: none;
  text-decoration: underline;
  background: none;
  padding: 0;
  font-size: 1rem;
  cursor: pointer;
  text-align: center;
`

const ButtonSmall = ({ onClick, children }) => <TextButton onClick={onClick}>{children}</TextButton>

ButtonSmall.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.string
}

export default ButtonSmall
