import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'

export const isoStringToDate = isoString => format(parseISO(isoString), 'd.M.yyyy HH.mm')
