import {readdirSync} from 'fs'
import {getValue, distance as calcDistance} from './util'

const RESTAURANTS = readdirSync(`${__dirname}/restaurants`)
                      .map((x) => x.replace(/\.js$/, ''))

export function getRestaurant (restaurantId) {
  // provider|parser
  // provider(arg1 arg2)|parser
  var m = restaurantId.match(/^(\w+)(?:\(([^)]+)\))?\|(\w+)$/)
  if (m) {
    try {
      var Provider = require(`./providers/${m[1]}`).default
    } catch (e) {
      throw new Error(`Unknown provider ${m[1]}`)
    }
    try {
      var Parser = require(`./parsers/${m[3]}`).default
    } catch (e) {
      throw new Error(`Unknown parser ${m[3]}`)
    }
    return {
      provider () {
        return new Provider(...(m[2] || '').split(' '))
      },
      parser () {
        return new Parser()
      },
      async data () {
        if (Parser.prototype.parseData) {
          var body = await this.provider().fetch()
          return this.parser().parseData(body)
        }
        return {
          name: m[0]
        }
      }
    }
  }
  try {
    return require(`./restaurants/${restaurantId}`)
  } catch (e) {
    throw new Error(`Restaurant not found: ${restaurantId}`)
  }
}

export async function getRestaurants (args) {
  var {id, loc, distance} = args
  var ids
  if (!loc && 'distance' in args) {
    throw new Error('loc argument is mandatory, when using distance')
  }
  id = getValue(id)
  if (id) {
    if (!id.not) {
      ids = [id.value]
    }
  }
  if (!ids) {
    ids = RESTAURANTS
  }
  if (id && id.not) {
    ids = ids.filter((x) => x !== id.value)
  }
  var data = await Promise.all(ids.map((id) => getRestaurant(id).data()))
  var restaurants = ids.map((id, i) => ({
    ...data[i],
    id
  }))
  if (loc) {
    restaurants.forEach((r) => {
      var {location} = r
      r.distance = calcDistance(loc.lat, loc.lon, location.lat, location.lon)
    })
    if (distance != null) {
      restaurants = restaurants.filter((r) => r.distance <= distance)
    }
  }
  return restaurants
}
