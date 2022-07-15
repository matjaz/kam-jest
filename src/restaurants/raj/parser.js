import cheerio from 'cheerio'

import { findDates, getPrice, toISODate } from '../../util'
import { OfferTypes } from '../../offers'

export default class RajParser {
  parse (data) {
    const $ = cheerio.load(data)
    const type = OfferTypes.MALICA
    const week = {}
    $('.dan').each(function (i, el) {
      const $el = $(el)
      const h3Text = $el.find('h3').text().trim()
      const date = findDates(h3Text)[0]
      if (!date) {
        return
      }
      var offers = []
      $el.find('table tr').each(function(i, el) {
        const tds = $(el).find('td')
        offers.push({
            text: $(tds[0]).text(),
            price: getPrice($(tds[1]).text()),
            type,
          })
      })
      if (offers.length) {
        week[toISODate(date)] = {
          offers
        }
      }
    })
    return week
  }
}
