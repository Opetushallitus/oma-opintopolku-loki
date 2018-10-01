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
  font-weight: 600;
`

const ButtonSmall = ({ onClick, attributes = {}, children }) => <TextButton onClick={onClick} {...attributes}>{children}</TextButton>

ButtonSmall.propTypes = {
  onClick: PropTypes.func.isRequired,
  attributes: PropTypes.object,
  children: PropTypes.string
}

export default ButtonSmall
