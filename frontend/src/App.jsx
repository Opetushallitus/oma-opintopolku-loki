import React from 'react'
import styled from 'styled-components'
import theme from './ui/theme'
import Header from './component/Header'

const Content = styled.article`
  font-family: ${theme.font.family};
`

const App = () => (
  <Content>
    <Header/>
  </Content>
)

export default App
