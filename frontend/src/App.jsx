import React from 'react'
import styled from 'styled-components'
import constants from 'ui/constants'
import Header from 'component/Header'
import LogEntries from 'component/LogEntries'

/**
 * Root style wrapper.
 * Applies base CSS properties.
 */
const Content = styled.article`
  font-family: ${constants.font.family};
`

const App = () => (
  <Content>
    <Header/>
    <LogEntries/>
  </Content>
)

export default App
