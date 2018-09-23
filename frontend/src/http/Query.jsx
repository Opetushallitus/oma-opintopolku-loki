import React from 'react'
import PropTypes from 'prop-types'
import http from './http'

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

  async doQuery () {
    try {
      const { data } = await http.get(this.props.url)

      this.setState({ data, pending: false })
    } catch (error) {
      this.setState({ error, pending: false })
    }
  }

  render () {
    return this.props.children(this.state)
  }
}

export default Query

Query.propTypes = {
  url: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired
}
