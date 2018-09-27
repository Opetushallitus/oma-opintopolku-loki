import React from 'react'
import styled, { injectGlobal } from 'styled-components'
import constants from 'ui/constants'
import Header from 'component/Header'
import LogEntries from 'component/LogEntries'

/**
 * Apply global styles.
 * TODO: Styled Components API for defining global styles will change in next major version (v4).
 */
injectGlobal`
  body, button, input, optgroup, select, textarea {
    font-family: ${constants.font.family};
  }
`

const Content = styled.main`
  max-width: ${constants.layout.maxContentWidth};
  margin: auto;
`

const App = () => (
  <Content>
    <Header/>
    <LogEntries/>
  </Content>
)

export default App
