import 'util/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import App from 'App'
import 'service/raamitSupport'

ReactDOM.render(
  <App />,
  document.getElementById('react-root')
)
