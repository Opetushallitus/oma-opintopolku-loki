import React from 'react'
import PropTypes from 'prop-types'
import http from 'http/http'
import { withErrorBoundary } from 'component/generic/enhance/ErrorBoundary'

class Query extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      data: null,
      error: null,
      pending: true
    }
  }

  componentDidMount () {
    this.doQuery()
  }

  componentDidUpdate (prevProps) {
    if (
      prevProps.url !== this.props.url ||
      prevProps.method !== this.props.method ||
      prevProps.body !== this.props.body
    ) {
      this.doQuery()
    }
  }

  async doQuery () {
    const { url, method, body } = this.props

    try {
      const { data } = await http.request(url, method, body)
      this.setState({ data, pending: false })
      if (this.props.onSuccess) this.props.onSuccess(data)
    } catch (error) {
      console.error(error)
      this.setState({ error, pending: false })
    }
  }

  render () {
    return this.props.children(this.state)
  }
}

Query.defaultProps = {
  method: 'get',
  body: {}
}

Query.propTypes = {
  url: PropTypes.string.isRequired,
  method: PropTypes.string,
  body: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),
  children: PropTypes.func.isRequired,
  onSuccess: PropTypes.func
}

export default withErrorBoundary(Query)
