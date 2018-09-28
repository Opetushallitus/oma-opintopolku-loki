import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const MARGIN = '1rem'

const DateTable = styled.table`
  padding: 0 ${MARGIN} ${MARGIN} ${MARGIN};
`

const DateList = ({ dates }) => (
  <DateTable>
    <tbody>
      {dates.map((t, i) => (
        <tr key={`${t}_${i}`}>
          <td>{t}</td>
        </tr>
      ))}
    </tbody>
  </DateTable>
)

DateList.propTypes = {
  dates: PropTypes.array.isRequired
}

export default DateList
