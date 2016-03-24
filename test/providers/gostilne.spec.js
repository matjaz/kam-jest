import nock from 'nock'
import {expect} from 'chai'

import GostilneProvider from '../../src/providers/gostilne'

describe('Gostilne provider', () => {
  it('should make http request', (done) => {
    nock('http://www.gostilne.si')
      .get('/jsonGostilne.php?action2=hash&pos=46%2C15&hash=test')
      .reply(200, '{"ok":true}')

    new GostilneProvider('test').fetch().then((resp) => {
      expect(resp).to.eql({
        ok: true
      })
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
