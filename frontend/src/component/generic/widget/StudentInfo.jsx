import React from 'react'
import styled from 'styled-components'
import constants from 'ui/constants'
import { H3 } from 'ui/typography'
import media from 'ui/media'
import t from 'util/translate'
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
`

class StudentInfo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: null,
      birthday: null
    }
  }

  componentDidMount () {
    this.getName()
  }

  async getName() {
    const whoami = await http.get('whoami')
    this.setState({
      name: parseUserName(whoami.data),
      birthday: '1.1.2009'
    })
  }

  render() {
    if (!this.state.name || !this.state.birthday) return null

    return (
      <Student>
        <Name>{this.state.name}</Name>
        <Birthday> {this.state.birthday}</Birthday>
      </Student>
    )
  }
}

export default StudentInfo
