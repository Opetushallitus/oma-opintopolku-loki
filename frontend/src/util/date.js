import { format, parseISO } from 'date-fns'

export const isoStringToDate = isoString => format(parseISO(isoString), 'd.M.yyyy HH.mm')
