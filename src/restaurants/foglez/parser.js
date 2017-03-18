import {findDatesISO, getLines, toISODate, addToDate} from '../../util'
import {DAYS, OfferTypes} from '../../offers'

const DEFAULT_PRICE = 4.5

export default class FoglezParser {
  isCandidate (post) {
    var message = post.message
    return message && message.indexOf(' MALIC ') !== -1
  }

  parse (post) {
    var week
    var startDate
    var dayOffers
    var type = OfferTypes.from('MALICA')
    if (this.isCandidate(post)) {
      var lines = getLines(post.message)
      if (lines[0].startsWith(DAYS[0])) {
        startDate = toISODate(post.created_time)
      } else {
        let dates = findDatesISO(lines.shift())
        startDate = dates.length ? dates[0] : '-'
      }
      lines.some((line) => {
        var daysIndex
        line = line.trim()
        if (line.indexOf('dostavimo') !== -1) {
          return true
        }
        if ((daysIndex = DAYS.indexOf(line.toUpperCase())) !== -1) {
          let date = startDate === '-' ? '-' : addToDate(startDate, daysIndex)
          week = week || {}
          let dayData = week[date] || (week[date] = {offers: []})
          dayOffers = dayData.offers
        } else if (line && dayOffers) {
          let allergens = line.match(/\((.*)\)/)
          if (allergens) {
            allergens = allergens[1].split(',').map((x) => x.trim())
          }
          dayOffers.push({
            text: line.replace(/^-\s*/, '').replace(/\s*\(.*\)*$/, ''),
            price: DEFAULT_PRICE,
            type: type,
            allergens: allergens || [],
            line: line
          })
        }
      })
      return week
    }
  }
}
