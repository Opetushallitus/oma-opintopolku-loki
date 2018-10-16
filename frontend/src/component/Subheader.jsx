import React from 'react'
import styled from 'styled-components'
import constants from 'ui/constants'
import t from 'util/translate'

const Container = styled.div`
  margin-bottom: 0.571rem;
  padding-left: 1.5rem;
  padding-bottom: 0.429rem;
  border-bottom: 1px solid ${constants.color.primary};
  font-size: ${constants.font.size.s};
  letter-spacing: 0.0125rem;
`

const Subheader = () => (
  <Container>{t`Tietojen käyttäjä`}</Container>
)

export default Subheader
