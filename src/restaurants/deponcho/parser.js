import { findDatesISO, getPrice } from '../../util'
import { OfferTypes } from '../../offers'

import cheerio from 'cheerio'

const DEFAULT_PRICE = 5

export default class DePonchoParser {
  parse (html) {
    var offers
    var dayOffers
    var $ = cheerio.load(html)
    var elements = $.root().find('#content .contentpaneopen td > :not(p)')
    var type = OfferTypes.from('MALICA')
    elements.each(function () {
      var el = $(this)
      if (el.is('ul')) {
        el.find('li').each(function () {
          var text = $(this).text().trim()
          if (!text || !dayOffers || text.startsWith('Dnevna')) {
            return
          }
          var price = DEFAULT_PRICE
          var m = text.match(/\s(\d+(,\d+)?)\s+EUR/)
          if (m) {
            const pPrice = getPrice(m[1])
            if (pPrice) {
              price = pPrice
              text = text.slice(0, m.index).trim()
            }
          }
          var allergens
          var match = text.match(/(?:\w+\s*\d:\s*)?(.*?)\s*\((?:\w+:)(.*?)\)\s*\d*,?\d*.?$/)
          if (match) {
            allergens = match[2].split(',').map((x) => x.trim())
            text = match[1]
          } else {
            allergens = []
          }
          dayOffers.push({
            price,
            text,
            allergens,
            type
          })
        })
      } else {
        var text = el.text().trim()
        var date = findDatesISO(text)[0]
        if (date) {
          dayOffers = []
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
