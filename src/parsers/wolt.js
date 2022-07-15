import { addToDate, getLines } from '../util'
import { OfferTypes } from '../offers'

function getMondayOfCurrentWeek() {
  const now = new Date()
  const first = now.getDate() - now.getDay() + 1
  return new Date(now.setDate(first))
}

export default class WoltParser {
  parse (data) {
    var week = {}
    const monday = getMondayOfCurrentWeek()
    data.items.filter(i => i.enabled).forEach(item => {
      if (!item.times[0]) {
        return
      }
      item.times[0].available_days_of_week.forEach(dow => {
        const date = addToDate(monday, dow - 1)
        let day = week[date]
        if (!day) {
          day = week[date] = {
            offers: []
          }
        }
        let text = item.name.replace('(slika je simbolična)', '').trim()
        if (item.description) {
          text += ', ' + item.description.replace('Dodatek:', '').trim()
        }
        const { offers } = day
        const type = this.mapItemToType(item, data)
        offers.push({
          text,
          type,
          image: item.image,
          price: item.baseprice / 100
        })
      })
    })
    return week
  }

  mapItemToType(item, data) {
    const cat = data.categories.find(c => c.id === item.category)
    if (cat) {
      switch(cat.name) {
        case 'KOSILO':
        case 'KOSILA':
          return OfferTypes.KOSILO
      }
    }
    return OfferTypes.MALICA
  }

  parseData(data) {
    return {
      name: data.name,
      location: data.location.coordinates,
    }
  }
}
