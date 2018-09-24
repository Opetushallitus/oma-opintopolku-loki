import './util/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import translations from '../resources/translations'
import './service/raamitSupport'

window.translationsMap = translations

ReactDOM.render(
  <App />,
  document.getElementById('react-root')
)
