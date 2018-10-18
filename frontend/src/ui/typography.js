import styled from 'styled-components'
import constants from 'ui/constants'
import media from 'ui/media'

export const H1 = styled.h1`
  font-size: 2.667rem;
  font-weight: 700;
  
  ${media.full`
    font-size: ${constants.font.size.xxxl};
  `}
`

export const H2 = styled.h2`
  font-size: ${constants.font.size.xxl};
  line-height: 1.4;
  font-weight: 600;
`

export const H3 = styled.h3`
  font-size: ${constants.font.size.l};
  font-weight: 400;
`

export const Lead = styled.p`
  font-size: ${constants.font.size.xl};
`

export const AlertText = styled.strong`
  font-size: ${constants.font.size.xl};
  font-weight: 600;
`

export const Link = styled.a`
  text-decoration: underline;
  color: black;
`

export const Bold = styled.b`
  font-weight: 600;
`
