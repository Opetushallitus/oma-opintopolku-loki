import { isoStringToDate } from './date'

describe('isoStringToDate', () => {
  it('formats a timestamp with positive offset, preserving the original time', () => {
    expect(isoStringToDate('2026-01-19T14:12:00.000+03')).toBe('19.1.2026 14:12')
  })

  it('formats a UTC timestamp without shifting to browser timezone', () => {
    expect(isoStringToDate('2026-01-19T14:12:00.000+00')).toBe('19.1.2026 14:12')
  })

  it('formats a timestamp with full offset notation', () => {
    expect(isoStringToDate('2026-07-15T09:05:30.123+03:00')).toBe('15.7.2026 09:05')
  })

  it('formats a timestamp without offset (Z or bare)', () => {
    expect(isoStringToDate('2026-12-01T23:59:00Z')).toBe('1.12.2026 23:59')
  })

  it('strips leading zeros from day and month', () => {
    expect(isoStringToDate('2026-01-05T08:03:00.000+02')).toBe('5.1.2026 08:03')
  })

  it('returns the original string if format is unrecognized', () => {
    expect(isoStringToDate('not-a-date')).toBe('not-a-date')
  })
})
