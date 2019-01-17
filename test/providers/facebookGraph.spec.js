import nock from 'nock'
import { expect } from 'chai'

import FacebookGraphProvider from '../../src/providers/facebookGraph'

describe('Http provider', () => {
  it('should make http request', (done) => {
    nock('https://graph.facebook.com')
      .get('/1337/posts')
      .query(true)
      .reply(200, '{"data":{"test":"ok"}}')

    new FacebookGraphProvider('1337').fetch().then((resp) => {
      expect(resp).to.eql({
        test: 'ok'
      })
      done()
    })
  })
})
