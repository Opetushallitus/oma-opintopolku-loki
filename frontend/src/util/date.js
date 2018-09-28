import moment from 'moment'
import { lang } from 'util/preferences'

moment.locale(lang)

export const isoStringToDate = isoString => moment(isoString).format('l, LT')
