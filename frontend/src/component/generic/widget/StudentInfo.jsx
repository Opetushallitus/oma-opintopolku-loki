import React from 'react'
import styled from 'styled-components'
import { H3 } from 'ui/typography'
import { parseUserName } from 'service/raamitSupport'
import Query from 'http/Query'

const Student = styled(H3)`
  margin-top: 3rem;
  margin-bottom: 2.214rem;
`

export const Name = styled.span`
  font-weight: 600;
`
export const Birthday = styled.span`
  font-weight: 400;
`

const parseCentury = (hetu) => {
  const pattern = /\d{6}([-A+])/
  const matches = hetu.match(pattern)
  const separator = matches[1]

  switch (separator) {
    case '+':
      return 1800
    case separator.match(/[-YXWVU]/)?.input: // hack to use regex in switch statement
      return 1900
    case separator.match(/[ABCDEF]/)?.input:
      return 2000
  }
}

const parseBirthday = (hetu) => {
  try {
    const pattern = /(\d{2})/g
    const matches = hetu.match(pattern)

    const day = parseInt(matches[0])
    const month = parseInt(matches[1])
    const yearSuffix = parseInt(matches[2])

    const year = parseCentury(hetu) + yearSuffix

    return `${day}.${month}.${year}`
  } catch (err) {
    console.log('Failed to parse birthday', err) // TODO: Log errors remotely
  }
}

const StudentInfo = () => (
  <Query url='whoami'>
    {({ data, error, pending }) => {
      if (error || pending) return null

      const name = parseUserName(data)
      const birthday = parseBirthday(data.hetu)

      return (
        <Student>
          <Name>{name}</Name>
          { birthday ? <Birthday> s. {birthday}</Birthday> : null }
        </Student>
      )
    }}
  </Query>
)

export default StudentInfo
