import React from 'react'
import styled from 'styled-components'
import constants from 'ui/constants'
import { H3 } from 'ui/typography'
import http from 'http/http'
import { parseUserName } from '../../../service/raamitSupport'

const Student = styled.h3`
  margin-top: 3rem;
  margin-bottom: 2.214rem;
    
  font-size: ${constants.font.size.l};
  font-weight: 400;
`

const Name = styled.span`
  font-weight: 600;
`
const Birthday = styled.span`
  font-weight: 400;
`

class StudentInfo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: null,
      birthday: null
    }
  }

  componentDidMount() {
    this.getStudentDetails()
  }

  async getStudentDetails() {
    const whoami = await http.get('whoami')
    this.setState({
      name: parseUserName(whoami.data),
      birthday: whoami.data.syntymaaika
    })
  }

  render() {
    if (!this.state.name || !this.state.birthday) return null

    return (
      <Student>
        <Name>{this.state.name}</Name>
        <Birthday> s.{this.state.birthday}</Birthday>
      </Student>
    )
  }
}

export default StudentInfo
