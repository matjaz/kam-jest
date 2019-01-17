import { findDatesISO, toISODate, getLines, getPrice } from '../../util'
import { OfferTypes } from '../../offers'

export default class PriOvinkuParser {
  isCandidate (post) {
    var message = post.message
    return message && message.includes(' JUHA')
  }

  parse (post) {
    var week
    var dayOffers
    var type = OfferTypes.MALICA
    if (this.isCandidate(post)) {
      let start
      var lines = getLines(post.message)
      var date = findDatesISO(lines[0])[0]
      if (!date) {
        date = post.created_time.slice(0, 10)
        if (date !== toISODate()) { // today?
          return
        }
      }
      week = week || {}
      let dayData = week[date] || (week[date] = { offers: [] })
      dayOffers = dayData.offers
      lines.some((line) => {
        line = line.trim()
        if (line.includes(' JUHA')) {
          start = true
          return
        }
        if (!start || line.includes(' PONUDBA')) {
          // skip
          return
        }
        if (line.includes('DOSTAVA') || line.includes('Products')) {
          // end
          return true
        }
        line.split(/€/g).forEach(line => {
          if (!line) {
            return
          }
          let price = getPrice(line)
          let text
          let allergens
          let lineMatch = line.match(/(?:\s*\*?)(.*?)\s*\((.*?)\)\s*\d*,?\d*.?$/)
          if (lineMatch) {
            allergens = lineMatch[2].split(',').map((x) => x.trim())
            text = lineMatch[1]
          } else {
            text = line.trim().replace(/\s+\d+(,\d+)?.?/, '').replace(/^\s*\*?/, '')
            allergens = []
          }
          dayOffers.push({
            text,
            price,
            type,
            allergens,
            line
          })
        })
      })
      return week
    }
  }
}
