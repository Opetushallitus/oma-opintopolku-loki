import { css } from 'styled-components'
import constants from 'ui/constants'

const full = (...declarations) => css`
  @media (min-width: ${constants.layout.breakpointFull}) {
    ${css(...declarations)}
  }
`

export default {
  full
}
