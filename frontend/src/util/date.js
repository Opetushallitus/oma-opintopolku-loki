import format from 'date-fns/format'

export const isoStringToDate = isoString => format(isoString, 'D.M.YYYY HH.mm')
