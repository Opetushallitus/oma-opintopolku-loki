import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { take } from 'ramda'

const MARGIN = '1rem'

const DateTable = styled.table`
  padding: 0 ${MARGIN} ${MARGIN} ${MARGIN};
`

const DateList = ({ dates, numShown }) => {
  const subList = numShown ? take(numShown, dates) : dates

  return (
    <DateTable>
      <tbody>
        {subList.map((d, i) => (
          <tr key={`${d}_${i}`}>
            <td>{d}</td>
          </tr>
        ))}
      </tbody>
    </DateTable>
  )
}

DateList.propTypes = {
  dates: PropTypes.array.isRequired,
  numShown: PropTypes.number
}

export default DateList
