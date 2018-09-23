import React from 'react'
import styled from 'styled-components'
import theme from './ui/theme'
import Header from './component/Header'
import LogEntries from './component/LogEntries'

/**
 * Root style wrapper.
 * Applies base CSS properties.
 */
const Content = styled.article`
  font-family: ${theme.font.family};
`

const App = () => (
  <Content>
    <Header/>
    <LogEntries/>
  </Content>
)

export default App
