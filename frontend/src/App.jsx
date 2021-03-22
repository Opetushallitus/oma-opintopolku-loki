import React from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import constants from 'ui/constants'
import media from 'ui/media'
import Header from 'component/Header'
import Log from 'component/Log'

/**
 * Apply global styles.
 */
const GlobalStyle = createGlobalStyle`
  body, button, input, optgroup, select, textarea {
    font-family: ${constants.font.family};
  }

  html {
    font-size: ${constants.font.size.xs};

    ${media.full`
      font-size: ${constants.font.size.base};
    `}
  }
`

const Content = styled.main`
  max-width: ${constants.layout.maxContentWidth};
  margin: 0 auto 2rem auto;
  padding: 0 1rem;
  box-sizing: border-box;
`

const App = () => (
  <Content>
    <GlobalStyle/>
    <Header/>
    <Log/>
  </Content>
)

export default App
