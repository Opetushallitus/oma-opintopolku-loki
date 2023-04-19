import React from 'react'
import styled from 'styled-components'
import constants from 'ui/constants'
import t from 'util/translate'

const Container = styled.div`
  margin-bottom: 0.571rem;
  padding-left: 1.5rem;
  padding-right: 0.7rem;
  padding-bottom: 0.429rem;
  border-bottom: 1px solid ${constants.color.primary};
  font-size: ${constants.font.size.s};
  letter-spacing: 0.0125rem;
  display: flex;
`

const RightContainer = styled.div`
  margin-left: auto;
  text-align: right;
`

const OrganizationsHeader = () => (
  <Container>
    <div>{t('Tietojen käyttäjä')}{'**'}</div>
    <RightContainer>{t('Käytetty tietovaranto')}</RightContainer>
  </Container>
)

export default OrganizationsHeader
