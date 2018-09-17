import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import translations from '../resources/translations'

window.translationsMap = translations

ReactDOM.render(
  <App />,
  document.getElementById('react-root')
)
