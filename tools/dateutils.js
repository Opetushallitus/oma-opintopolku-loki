
const isoDateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/
const isoTimeRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}/

exports.toDate = (str) => {
  if (!str) return Date.parse('invalid')

  return new Date(str.match(isoDateRegex)[0] + 'T00:00:00.000Z')
}

exports.isBetween = (date, start, end) => ( date >= start && date <= end )

exports.endOfDay = (date) => new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59))

exports.addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

exports.addHours = (date, hours) => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

exports.toIsoDate = (date) => date.toISOString().match(isoDateRegex)[0]
exports.toIsoTime = (date) => date.toISOString().match(isoTimeRegex)[0]

