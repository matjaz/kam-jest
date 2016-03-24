import cheerio from 'cheerio'

import {findDatesISO, getPrice} from '../util'
import {OfferTypes} from '../offers'

export default class GostilneParser {

  parse (data) {
    if (!data || data.out !== 'OK') {
      return
    }
    var offers
    var $ = cheerio.load(data.con)
    var elements = $.root().children('p')
    var dates = findDatesISO(elements.first().text())
    if (dates.length) {
      var date = dates[0]
      var dayOffers = []
      var type = OfferTypes.from('MALICA')
      offers = {
        [date]: {
          offers: dayOffers
        }
      }
      var done
      elements.nextAll('p').each(function () {
        var text = $(this).text()
        if (!text || done) {
          return
        }
        if (text.toUpperCase().indexOf('SEZNAM ALERGENOV') !== -1) {
          done = true
          return
        }
        dayOffers.push({
          text: text.replace(/\s*\-?\s*\d*[,.]\d*.$/, '').trim(),
          price: getPrice(text),
          type: type
        })
      })
    }
    return offers
  }

  parseData (data) {
    return {
      name: data.name
    }
  }

}
