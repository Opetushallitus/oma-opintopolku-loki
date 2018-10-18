import React from 'react'
import styled, { injectGlobal } from 'styled-components'
import constants from 'ui/constants'
import media from 'ui/media'
import Header from 'component/Header'
import Subheader from 'component/Subheader'
import Log from 'component/Log'


/**
 * Apply global styles.
 * TODO: Styled Components API for defining global styles will change in next major version (v4).
 */
injectGlobal`
  body, button, input, optgroup, select, textarea {
    font-family: ${constants.font.family};
  }
  
  * {
    box-sizing: border-box;
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
`

const App = () => (
  <Content>
    <Header/>
    <Subheader/>
    <Log/>
  </Content>
)

export default App
