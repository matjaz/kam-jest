import {getLines} from '../util'
import {OfferTypes} from '../offers'

export default class MalcajtParser {

  parse (data) {
    var offers
    var Lunch = data.Lunch
    if (Lunch) {
      let type = OfferTypes.MALICA
      offers = {}
      Lunch.forEach(l => {
        var dayOffers = []
        getLines(l.DayLunches.replace(/<br\s*?\/?>/g, '')).forEach(text => {
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
