import {expect} from 'chai'

import {getRestaurant, getRestaurants} from '../src/restaurants'
import FacebookGraphProvider from '../src/providers/facebookGraph'
import GostilneProvider from '../src/providers/gostilne'
import GostilneParser from '../src/parsers/gostilne'
import Selih from '../src/restaurants/selih/parser'

describe('getRestaurant', () => {
  it('should return provider & parser', () => {
    var restaurant = getRestaurant('selih')
    expect(restaurant)
      .to.have.property('provider')
      .that.is.an.instanceof(Function)
    expect(restaurant)
      .to.have.property('parser')
      .that.is.an.instanceof(Function)
    expect(restaurant)
      .to.have.property('data')
      .that.is.an.instanceof(Function)
    expect(restaurant.provider())
      .is.an.instanceof(FacebookGraphProvider)
    expect(restaurant.parser())
      .is.an.instanceof(Selih)
    expect(restaurant.data())
      .to.have.property('name')
  })

  it('should return error for invalid id', () => {
    var fn = () => getRestaurant('404')
    expect(fn).to.throw('Restaurant not found: 404')
  })

  it('should return dynamic provider & parser', () => {
    var restaurant = getRestaurant('gostilne(test)|gostilne')
    expect(restaurant)
      .to.have.property('provider')
      .that.is.an.instanceof(Function)
    expect(restaurant)
      .to.have.property('parser')
      .that.is.an.instanceof(Function)
    expect(restaurant)
      .to.have.property('data')
      .that.is.an.instanceof(Function)
    var provider = restaurant.provider()
    expect(provider)
      .is.an.instanceof(GostilneProvider)
    expect(restaurant.parser())
      .is.an.instanceof(GostilneParser)
    expect(provider.url)
      .to.equal('http://www.gostilne.si/jsonGostilne.php?action2=hash&pos=46%2C15&hash=test')
  })
})

describe('getRestaurants', function () {
  this.timeout(5000)

  it('should get all restaurants', async function (done) {
    var list = await getRestaurants({})
    expect(list).to.be.an('array')
    expect(list.length).to.be.above(5)
    done()
  })

  it('should return only one restaurant', async function (done) {
    var list = await getRestaurants({id: 'selih'})
    expect(list.length).to.equal(1)
    done()
  })

  it('should exclude restaurant', async function (done) {
    var list = await getRestaurants({id: '!selih'})
    expect(list.map((x) => x.id)).not.to.include('selih')
    done()
  })

  it('should calculate distance when location is provided', async function (done) {
    var list = await getRestaurants({
      id: 'selih',
      loc: {
        lat: 46.522425,
        lon: 15.669608
      }
    })
    expect(list.length).to.equal(1)
    expect(list[0])
      .to.have.property('distance')
      .that.is.above(1)
    done()
  })

  it('should filter by lesser distance', async function (done) {
    var list = await getRestaurants({
      loc: {
        lat: 46.522425,
        lon: 15.669608
      },
      distance: 2
    })
    expect(list.length).is.above(1)
    list.forEach((r) => {
      expect(r)
        .to.have.property('distance')
        .that.is.below(2)
    })
    done()
  })

  it('should throw error for invalid id', async function (done) {
    try {
      await getRestaurants({id: '404'})
    } catch (e) {
      expect(e.message).to.equal('Restaurant not found: 404')
      done()
    }
  })

  it('should throw error when filtering by distance and loc is missing', async function (done) {
    try {
      await getRestaurants({
        distance: 0
      })
    } catch (e) {
      expect(e.message).to.equal('loc argument is mandatory, when using distance')
      done()
    }
  })
})
