import {expect} from 'chai'
import sinon from 'sinon'

import * as restaurants from '../src/restaurants'
import {DAYS, ALL_DAYS, OfferTypes, getDailyOffers} from '../src/offers'

describe('DAYS', () => {
  it('should contain 5 workdays', () => {
    expect(DAYS.length).to.equal(5)
  })
})

describe('ALL_DAYS', () => {
  it('should contain 7 days', () => {
    expect(ALL_DAYS.length).to.equal(7)
  })
})

describe('OfferTypes', () => {
  it('should map string to OfferType', () => {
    expect(OfferTypes.from('KOSILO')).to.equal(1)
  })

  it('should throw error on unknow type', () => {
    var fn = () => {
      OfferTypes.from('404')
    }
    expect(fn).to.throw('Invalid offer type value: 404')
  })

  it('should not throw error if lax', () => {
    var fn = () => {
      OfferTypes.from('404', true)
    }
    expect(fn).not.to.throw()
  })
})

describe('getDailyOffers', () => {
  var provider
  var parser
  var parse
  var parseData
  var data
  beforeEach(() => {
    provider = sinon.stub().returns({
      fetch () {
        return 'content'
      }
    })
    parseData = {
      '0000-00-00': {
        offers: [{
          text: 'pizza',
          price: 13.37,
          type: 1,
          allergens: []
        }]
      },
      '0000-01-01': {
        offers: [{
          text: 'burrito',
          price: 42,
          type: 2,
          allergens: []
        }]
      }
    }
    parse = sinon.spy(() => parseData)
    parser = sinon.stub().returns({
      parse
    })
    data = sinon.stub().returns({
      name: 'test'
    })
    sinon.stub(restaurants, 'getRestaurant', () => {
      return {
        provider,
        parser,
        data
      }
    })
  })

  afterEach(() => {
    restaurants.getRestaurant.restore()
  })

  it('should get simple', async function () {
    var res = await getDailyOffers('test', {
      date: '0000-00-00',
      type: 'KOSILO'
    })
    expect(parse.calledWithExactly('content')).to.equal(true)
    expect(res).to.be.an('array')
  })

  it('should fix January', async function () {
    var year = new Date().getFullYear()
    parseData[`${year - 1}-01-01`] = parseData['0000-01-01']
    delete parseData['0000-01-01']
    var res = await getDailyOffers('test', {})
    expect(res.map((x) => x.date)).to.eql(['0000-00-00', `${year}-01-01`])
  })

  it('should not fix January', async function () {
    var res = await getDailyOffers('test', {})
    expect(res.map((x) => x.date)).to.eql(['0000-00-00', '0000-01-01'])
  })

  it('should not check January issue', async function () {
    parseData['0000-00-01'] = parseData['0000-01-01']
    delete parseData['0000-01-01']
    var res = await getDailyOffers('test', {})
    expect(res.map((x) => x.date)).to.eql(['0000-00-00', '0000-00-01'])
  })

  it('should exclude type', async function () {
    var res = await getDailyOffers('test', {
      type: '!KOSILO'
    })
    expect(res.reduce((sum, dailyOffer) => sum + dailyOffer.offers.length, 0))
      .to.equal(1)
  })
})
