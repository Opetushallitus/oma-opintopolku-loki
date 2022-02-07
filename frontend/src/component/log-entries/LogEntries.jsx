import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { descend, identity, sort } from 'ramda'
import t from 'util/translate'
import { isoStringToDate } from 'util/date'
import constants from 'ui/constants'
import { Bold } from 'ui/typography'
import media from 'ui/media'
import ButtonSmall from 'component/generic/widget/ButtonSmall'
import DateList from 'component/generic/widget/DateList'

const NUM_INITIAL_DATES = 10
const NUM_SHOW_MORE_DATES = 10
const MARGIN = '1rem'

const Container = styled.div`
  margin: ${MARGIN} -${MARGIN} 0 -${MARGIN};
  padding: ${MARGIN};
  background-color: ${({ showList }) => showList ? constants.color.background.neutralLight : 'none'};
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-direction: column;
  margin-bottom: 0.5rem;

  & > button {
    text-align: left;
  }

  ${media.full`
    flex-direction: row-reverse;
    margin-left: ${MARGIN};

    & > button {
      text-align: initial;
    }
  `}
`

const BottomRow = styled.div`
  margin-left: ${MARGIN};
`

const LogEntries = ({ timestamps }) => {
  const [showDates, setShowDates] = useState(false)
  const toggleShowDates = useCallback(() => { setShowDates(!showDates) }, [showDates])

  const [numDatesShown, setNumDatesShown] = useState(NUM_INITIAL_DATES)
  const showMoreDates = useCallback(() => { setNumDatesShown(numDatesShown + NUM_SHOW_MORE_DATES) }, [numDatesShown])

  const hasMoreEntries = numDatesShown < timestamps.length
  const sortedTimestamps = sort(descend(identity), timestamps)
  const dates = sortedTimestamps.map(isoStringToDate)

  return (
    <Container showList={showDates}>
      <TopRow>
        <ButtonSmall onClick={toggleShowDates} attributes={{ 'aria-pressed': showDates }}>
          {showDates ? t`Piilota käyttökerrat` : t`Taulukko tietojen käyttökerroista`}
        </ButtonSmall>
        {showDates && (
          <Bold>
            {t`Näytetään käyttökerrat`}
            {` 1–${Math.min(numDatesShown, dates.length)} / ${dates.length}`}
          </Bold>
        )}
      </TopRow>

      {showDates && (
        <React.Fragment>
          <DateList dates={dates} numShown={numDatesShown} />

          {hasMoreEntries && (
            <BottomRow>
              <ButtonSmall onClick={showMoreDates}>{t`Näytä lisää käyttökertoja`}</ButtonSmall>
            </BottomRow>
          )}
        </React.Fragment>
      )}
    </Container>
  )
}

LogEntries.propTypes = {
  timestamps: PropTypes.array.isRequired
}

export default LogEntries
