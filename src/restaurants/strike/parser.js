import htmlToText from 'html-to-text'

import {findDatesISO, getLines, getPrice, addToDate} from '../../util'
import {DAYS, OfferTypes} from '../../offers'

const DEFAULT_PRICE = 4.2

export default class StrikeParser {

  isCandidate (text) {
    return text && text.indexOf(' MALIC ') !== -1
  }

  parse (pageSource) {
    var text = htmlToText.fromString(pageSource, {
      wordwrap: Infinity
    })
    var week
    if (this.isCandidate(text)) {
      var dayOffers
      var type = OfferTypes.from('MALICA')
      // cut of beginning
      var pos = text.indexOf('TEDENSKA PONUDBA')
      if (pos !== -1) {
        text = text.slice(pos)
      }
      var lines = getLines(text)
      var dates = findDatesISO(lines.shift())
      var startDate = dates.length ? dates[0] : '-'
      var priceResult = text.match(/=\s*(\d+,\d{2})€/)
      var price = priceResult && getPrice(priceResult[0]) || DEFAULT_PRICE
      lines.some((line) => {
        var daysIndex
        line = line.trim()
        if (line.toUpperCase().indexOf('STALNA') !== -1) {
          return true
        }
        if ((daysIndex = DAYS.indexOf(line.toUpperCase())) !== -1) {
          let date = startDate === '-' ? '-' : addToDate(startDate, daysIndex)
          week = week || {}
          let dayData = week[date] || (week[date] = {offers: []})
          dayOffers = dayData.offers
        } else if (line && dayOffers && line.match(/^\d/)) {
          let allergens = line.match(/\((.*)\)/)
          if (allergens) {
            allergens = allergens[1].split(',').map((x) => x.trim())
          }
          dayOffers.push({
            text: line.replace(/^\d+\.\s*/, '').replace(/\s*\(.*\)*$/, ''),
            price: price,
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
