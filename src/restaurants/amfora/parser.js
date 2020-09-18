import { addToDate } from '../../util'
import { OfferTypes } from '../../offers'

import cheerio from 'cheerio'
import moment from 'moment'

const price = 5.6

export default class AmforaParser {
  parse (html) {
    var offers
    var $ = cheerio.load(html)
    var elements = $.root().find('#contentinner h3.malice')
    var type = OfferTypes.from('MALICA')
    const days = ['Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek']
    const monday = moment().startOf('isoweek')
    elements.each(function () {
      var el = $(this)

      const dayIndex = days.indexOf(el.text())
      if (dayIndex === -1) {
        return
      }
      const nextEl = el.next()
      if (nextEl.is('ul')) {
        const date = addToDate(monday, dayIndex)
        const dayOffers = []
        nextEl.find('li').each(function () {
          const el = $(this)
          const text = el.text().trim()
          dayOffers.push({
            price,
            text,
            type
          })
        })
        if (dayOffers.length) {
          offers = offers || {}
          offers[date] = {
            offers: dayOffers
          }
        }
      }
    })
    return offers
  }
}
