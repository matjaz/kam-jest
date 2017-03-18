import htmlToText from 'html-to-text'

import {getLines, getPrice, findDatesISO} from '../../util'
import {ALL_DAYS, OfferTypes} from '../../offers'

export default class DaNoiParser {
  parse (pageSource) {
    var offers
    var dayOffers
    var price
    var allergens
    var offerText = ''
    var type = OfferTypes.from('MALICA')
    var text = htmlToText.fromString(pageSource, {
      wordwrap: Infinity
    })
    var posStart = text.indexOf('DNEVNA MALICA V')
    if (posStart !== -1) {
      var posEnd = text.indexOf('logotip')
      if (posEnd > posStart) {
        text = text.slice(posStart, posEnd)
      } else {
        text = text.slice(posStart)
      }
    }

    function addOffer () {
      // add previous offer
      if (dayOffers && offerText) {
        dayOffers.push({
          text: offerText.trim(),
          price: price,
          type: type,
          allergens: allergens
        })
        offerText = ''
      }
    }

    getLines(text).some((line) => {
      line = line.trim()
      if (!line) {
        // skip
        return
      }
      if (line.charAt(0) === '*') {
        // end
        return true
      }
      if (ALL_DAYS.some((day) => line.toUpperCase().includes(day.slice(0, 4)))) {
        allergens = undefined
        let dates = findDatesISO(line)
        if (dates.length) {
          var date = dates[0]
          offers = offers || {}
          if (offers[date]) {
            return true
          }
          dayOffers = []
          offers[date] = {offers: dayOffers}
        }
      } else if (dayOffers && line.match(/^\d/)) {
        addOffer()
        price = getPrice(line.slice(-10))
        offerText += `${line.replace(/(^\d+[.)]*\s*)|(\s*\d+,\d\d.+$)/g, '')} `
      } else if (line.includes('alergen')) {
        allergens = line.slice(18, -1).split(',').map((x) => x.trim())
      }
    })
    addOffer()
    return offers
  }
}
