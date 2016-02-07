import nock from 'nock'
import {expect} from 'chai'

import GostilneProvider from '../../src/providers/gostilne'

describe('Gostilne provider', () => {
  it('should make http request', (done) => {
    nock('http://www.gostilne.si')
      .get('/test.html')
      .reply(200, 'ok')

    new GostilneProvider('test').fetch().then((resp) => {
      expect(resp).to.equal('ok')
      done()
    })
  })

  it('should throw when id is not provided', () => {
    var fn = () => {
      new GostilneProvider().url
    }
    expect(fn).to.throw('Missing id')
  })
})
