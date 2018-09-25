import 'util/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import translations from 'mapping/translations'

import App from 'App'
import 'service/raamitSupport'

window.translationsMap = translations

ReactDOM.render(
  <App />,
  document.getElementById('react-root')
)
