/**
 * App-wide style constants based on Oma Opintopolku style guide.
 * Use these instead of ad-hoc values when possible.
 */
export default {
  color: {
    primaryLight: '#a2d8e9',
    primary: '#149ecb',
    primaryDark: '#00526c',
    alert: '#b90400',
    border: '#979797',
    white: '#ffffff',
    black: '#000000',
    gray: '#747474',
    background: {
      neutralLight: '#f5f5f5',
      primaryTintedLight: '#eaf8fb'
    }
  },
  font: {
    family: `'Source Sans Pro', sans-serif`, // eslint-disable-line quotes
    size: {
      xs: '0.75em', // base size for mobile
      s: '0.857rem',
      base: '0.875em', // ~14px with default browser font size of 16px
      m: '1.25rem',
      l: '1.286rem',
      xl: '1.429rem',
      xxl: '1.714rem',
      xxxl: '2.571rem',
      xxxxl: '2.667rem' // mobile ~32px
    }
  },
  layout: {
    maxContentWidth: '1160px',
    breakpointFull: '900px'
  }
}
