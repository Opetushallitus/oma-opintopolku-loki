import React from 'react'
import PropTypes from 'prop-types'
import { withState } from 'recompose'
import styled from 'styled-components'
import t from 'util/translate'
import constants from 'ui/constants'
import ButtonSmall from 'component/generic/widget/ButtonSmall'

const MARGIN = '1rem'

const TimestampView = styled.div`
  margin: ${MARGIN} -${MARGIN} 0 -${MARGIN};
  padding: ${MARGIN} ${MARGIN} 0 ${MARGIN};
  background-color: ${({ showList }) => showList ? constants.color.background.neutralLight : 'none'};
`

const TimestampTable = styled.table`
  padding: 0 ${MARGIN} ${MARGIN} ${MARGIN};
`

const TimestampViewTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
`

const withListToggle = withState('showTimestamps', 'setShowTimestamps', false)

const Timestamps = withListToggle(({ timestamps, showTimestamps, setShowTimestamps }) => {
  return (
    <TimestampView showList={showTimestamps}>
      <TimestampViewTopRow>
        <ButtonSmall onClick={() => setShowTimestamps(show => !show)}>
          {showTimestamps ? t`Piilota käyttökerrat` : t`Taulukko tietojen käyttökerroista`}
        </ButtonSmall>
      </TimestampViewTopRow>

      {showTimestamps && (
        <TimestampTable>
          <tbody>
            {timestamps.map((t, i) => <tr key={`${t}_${i}`}><td>{t}</td></tr>)}
          </tbody>
        </TimestampTable>
      )}
    </TimestampView>
  )
})

Timestamps.propTypes = {
  timestamps: PropTypes.array.isRequired
}

export default Timestamps
