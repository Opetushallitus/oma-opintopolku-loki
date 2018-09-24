import React from 'react'
import PropTypes from 'prop-types'
import t from 'util/translate'
import { AlertText } from '../../../ui/typography'

const getDisplayName = Component => Component.displayName || Component.name || 'Component'

const Alert = () => (
  <div>
    <AlertText>{t`Tapahtui odottamaton virhe`}</AlertText>
  </div>
)

class ErrorBoundary extends React.Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch (error, info) {
    console.warn(
      'Error occurred and fallback UI was rendered.',
      error,
      info
    )

    this.setState({ hasError: true })
  }

  render () {
    return this.state.hasError
      ? <Alert/>
      : this.props.children
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.element.isRequired
}

export const withErrorBoundary = Component => {
  const WithErrorBoundary = props => (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  )

  WithErrorBoundary.displayName = `WithErrorBoundary(${getDisplayName(Component)})`

  return WithErrorBoundary
}

export default ErrorBoundary
