import React from 'react'
import PropTypes from 'prop-types'
import { withState } from 'recompose'
import styled from 'styled-components'
import t from 'util/translate'
import constants from 'ui/constants'
import ButtonSmall from 'component/generic/widget/ButtonSmall'
import DateList from 'component/generic/widget/DateList'

const MARGIN = '1rem'

const Container = styled.div`
  margin: ${MARGIN} -${MARGIN} 0 -${MARGIN};
  padding: ${MARGIN} ${MARGIN} 0 ${MARGIN};
  background-color: ${({ showList }) => showList ? constants.color.background.neutralLight : 'none'};
`

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
`

const withListToggle = withState('showDates', 'setShowDates', false)

const LogEntries = withListToggle(({ timestamps, showDates, setShowDates }) => (
  <Container showList={showDates}>
    <TopRow>
      <ButtonSmall onClick={() => setShowDates(show => !show)}>
        {showDates ? t`Piilota käyttökerrat` : t`Taulukko tietojen käyttökerroista`}
      </ButtonSmall>
    </TopRow>

    {showDates && <DateList dates={timestamps} />}
  </Container>
))

LogEntries.propTypes = {
  timestamps: PropTypes.array.isRequired
}

export default LogEntries
