import React, { useState } from 'react'
import styled from 'styled-components'
import { Bold, H3, Select } from 'ui/typography'
import { parseUserName } from 'service/raamitSupport'
import Query from 'http/Query'
import PropTypes from 'prop-types'
import t from 'util/translate'

const Student = styled(H3)`
  margin: 2rem 0;
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

const StudentInfo = ({ selectedHetu, onSelectHetu }) => {
  const [data, setData] = useState()
  const huollettavat = data ? [data].concat(data.huollettavat) : []

  return (
    <>
      <Query url='/koski/api/omaopintopolkuloki/whoami' onSuccess={data => setData(data)}>
        {({ data, error, pending }) => {
          if (error || pending) return null

          const name = parseUserName(data)
          const birthday = parseBirthday(data.hetu)

          return (
            <Student>
              <Name>{name}</Name>
              {birthday ? <Birthday> s. {birthday}</Birthday> : null}
            </Student>
          )
        }}
      </Query>
      <PersonSelect selectedHetu={selectedHetu} huollettavat={huollettavat} onSelectHetu={onSelectHetu}/>
    </>
  )
}
StudentInfo.propTypes = ({
  selectedHetu: PropTypes.string,
  onSelectHetu: PropTypes.func
})

const PersonSelect = ({ selectedHetu, huollettavat, onSelectHetu }) => {
  return (
    <div>
      <Bold>{t('Tarkasteltava henkilö')}</Bold>
      <Select onChange={e => onSelectHetu(e.target.value)} defaultValue={selectedHetu}>
        {huollettavat.flatMap(h => h
          ? <PersonSelectOption key={h.hetu} etunimet={h.etunimet} sukunimi={h.sukunimi} hetu={h.hetu}/>
          : [])}
      </Select>
    </div>
  )
}
PersonSelect.propTypes = ({
  huollettavat: PropTypes.array,
  onSelectHetu: PropTypes.func,
  selectedHetu: PropTypes.string
})

const PersonSelectOption = ({ etunimet, sukunimi, hetu }) => {
  const name = parseUserName({ etunimet, sukunimi })
  const birthday = parseBirthday(hetu)
  return (
    <option value={hetu}>
      {name} {birthday ? ` s. ${birthday}` : null}
    </option>
  )
}
PersonSelectOption.propTypes = ({
  etunimet: PropTypes.string,
  sukunimi: PropTypes.string,
  hetu: PropTypes.string
})

export default StudentInfo
