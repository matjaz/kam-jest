import {getLines} from '../util'
import {OfferTypes} from '../offers'

export default class MalcajtParser {

  parse (data) {
    var offers
    const Lunch = data.Lunch
    if (Lunch) {
      const type = OfferTypes.MALICA
      offers = {}
      Lunch.forEach(l => {
        const dayOffers = []
        const lines = typeof l.DayLunches === 'string' ? getLines(l.DayLunches.replace(/<br\s*?\/?>/g, '')) : l.DayLunches
        lines.forEach(text => {
          text = text.trim()
          if (text) {
            dayOffers.push({
              text,
              type
            })
          }
        })
        if (dayOffers.length) {
          var date = `${l.Year}-${l.Month}-${l.Day}`
          offers[date] = {
            offers: dayOffers
          }
        }
      })
    }
    return offers
  }

  parseData (data) {
    var lat
    var lon
    var Cordinates = data.Cordinates
    if (Cordinates) {
      lat = parseFloat(Cordinates.X)
      lon = parseFloat(Cordinates.Y)
    }
    return {
      name: data.Title,
      location: {
        lat,
        lon
      }
    }
  }

}
