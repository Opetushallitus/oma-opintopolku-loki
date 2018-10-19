import React from 'react'
import styled from 'styled-components'
import { H3 } from 'ui/typography'
import http from 'http/http'
import { parseUserName } from 'service/raamitSupport'

const Student = styled(H3)`
  margin-top: 3rem;
  margin-bottom: 2.214rem;
`

const Name = styled.span`
  font-weight: 600;
`
const Birthday = styled.span`
  font-weight: 400;
`

class StudentInfo extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      name: null,
      birthday: null
    }
  }

  componentDidMount () {
    this.getStudentDetails()
  }

  parseCentury (hetu) {
    const pattern = /\d{6}([-A+])/
    const matches = hetu.match(pattern)
    const separator = matches[1]

    switch (separator) {
      case '+': return 1800
      case '-': return 1900
      case 'A': return 2000
    }
  }

  parseBirthday (hetu) {
    try {
      const pattern = /(\d{2})/g
      const matches = hetu.match(pattern)

      const day = parseInt(matches[0])
      const month = parseInt(matches[1])
      const yearSuffix = parseInt(matches[2])

      const year = this.parseCentury(hetu) + yearSuffix

      return `${day}.${month}.${year}`
    } catch (err) {
      // TODO: Log errors remotely
    }
  }

  async getStudentDetails () {
    const whoami = await http.get('whoami')
    this.setState({
      name: parseUserName(whoami.data),
      birthday: this.parseBirthday(whoami.data.hetu)
    })
  }

  render () {
    if (!this.state.name) return null

    return (
      <Student>
        <Name>{this.state.name}</Name>
        { this.state.birthday
          ? <Birthday> s. {this.state.birthday}</Birthday>
          : null
        }
      </Student>
    )
  }
}

export default StudentInfo
