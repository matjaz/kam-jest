import cheerio from 'cheerio'

import {findDatesISO, getPrice} from '../util'
import {OfferTypes} from '../offers'

export default class GostilneParser {

  parse (body) {
    var offers
    var $ = cheerio.load(body)
    var dates = findDatesISO($('.restaurant_card .sklop span').text())
    if (dates.length) {
      var date = dates[0]
      var dayOffers = []
      var offer
      var type
      offers = {
        [date]: {
          offers: dayOffers
        }
      }
      $('.restaurant_card').find('span.results_menu_2,.menudata,.menuprice').each(function () {
        var el = $(this)
        if (el.hasClass('results_menu_2')) {
          type = OfferTypes.from(el.text().toUpperCase(), true)
        } else if (type && el.hasClass('menudata')) {
          offer = {
            text: el.text(),
            price: undefined,
            type: type
          }
          dayOffers.push(offer)
        } else if (offer && el.hasClass('menuprice') && el.text()) {
          offer.price = getPrice(el.text())
        }
      })
    }
    return offers
  }

  parseData (body) {
    var $ = cheerio.load(body)
    var data = {
      name: $('#searchValue').text()
    }
    var pos = $('#restaurant_map').text().split(/,\s*/).map(parseFloat)
    if (pos.length === 2) {
      data.location = {
        lat: pos[0],
        lon: pos[1]
      }
    }
    return data
  }

}
