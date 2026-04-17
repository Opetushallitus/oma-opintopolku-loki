/**
 * Format an ISO 8601 timestamp string preserving its original timezone offset.
 *
 * parseISO + format would convert to the browser's local timezone, which shifts
 * the displayed time if the original offset differs (e.g. a summer +03:00
 * timestamp viewed in winter +02:00, or a UTC timestamp viewed in Finnish time).
 *
 * Instead we parse the date/time components directly from the string so the
 * displayed time matches the moment the event was recorded.
 */
export const isoStringToDate = isoString => {
  const match = isoString.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/)
  if (!match) return isoString
  const [, year, month, day, hour, minute] = match
  return `${parseInt(day)}.${parseInt(month)}.${year} ${hour}:${minute}`
}
