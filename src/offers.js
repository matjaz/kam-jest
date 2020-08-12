import { getValue } from './util'
import { getRestaurant } from './restaurants'

export const DAYS = ['PONEDELJEK', 'TOREK', 'SREDA', 'ČETRTEK', 'PETEK']
export const ALL_DAYS = DAYS.concat('SOBOTA', 'NEDELJA')
export const MONTHS = [
  'JANUAR',
  'FEBRUAR',
  'MAREC',
  'APRIL',
  'MAJ',
  'JUNIJ',
  'JULIJ',
  'AVGUST',
  'SEPTEMBER',
  'OKTOBER',
  'NOVEMBER',
  'DECEMBER'
]

export const OfferTypes = {
  KOSILO: 1,
  MALICA: 2,
  ZLICA: 3,
  VEGE: 4,
  from (val, lax) {
    if (typeof this[val] === 'number') {
      return this[val]
    }
    if (!lax) {
      throw new Error(`Invalid offer type value: ${val}`)
    }
  }
}

export async function getDailyOffers (restaurantId, args) {
  var dates
  var filterFn
  var { date } = args
  var type = getValue(args.type, (x) => OfferTypes.from(x))
  var restaurant = getRestaurant(restaurantId)
  var allOffers = await findOffers(restaurant.provider(), restaurant.parser())
  if (!allOffers) {
    return []
  }
  if (date) {
    dates = [date]
  } else {
    dates = Object.keys(allOffers)
    // increase year in January (providers forgot to change year)
    if (dates.length && dates[dates.length - 1].slice(5, 7) === '01') {
      var year = new Date().getFullYear()
      var prevYear = `${year - 1}`
      if (dates[dates.length - 1].slice(0, 4) === prevYear) {
        dates.forEach((date, i) => {
          if (date.slice(0, 7) === `${prevYear}-01`) {
            var newDate = year + date.slice(4)
            allOffers[newDate] = allOffers[date]
            delete allOffers[date]
            dates[i] = newDate
          }
        })
        dates = Object.keys(allOffers)
      }
    }
  }
  if (type) {
    filterFn = type.not ? (offer) => offer.type !== type.value : (offer) => offer.type === type.value
  }
  return dates.map((date) => {
    var offers = (allOffers[date] && allOffers[date].offers) || []
    var offersImages = allOffers[date] && allOffers[date].offersImages
    if (filterFn && offers.length) {
      offers = offers.filter(filterFn)
    }
    return {
      offers,
      offersImages,
      date
    }
  })
}

async function findOffers (provider, parser) {
  var posts = await provider.fetch()
  if (posts) {
    return extractOffers(posts, parser)
  }
}

function extractOffers (posts, parser) {
  if (!Array.isArray(posts)) {
    posts = [posts]
  }
  for (const post of posts) {
    const result = parser.parse(post)
    if (result) {
      return result
    }
  }
}
