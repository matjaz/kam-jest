import nock from 'nock';
import {expect} from 'chai';

import HttpJSONProvider from '../../src/providers/http-json';

describe('Http JSON provider', () => {

  it('should successfuly parse JSON', (done) => {
    nock('http://www.example.com')
      .get('/')
      .reply(200, '{"test": "ok"}');

    new HttpJSONProvider('http://www.example.com').fetch().then(resp => {
      expect(resp).to.eql({
        test: 'ok'
      });
      done();
    });
  });

  it('should fail on invalid JSON', (done) => {
    nock('http://www.example.com')
      .get('/')
      .reply(200, 'invalidJSON');

    (async () => {
      try {
        var r = await new HttpJSONProvider('http://www.example.com').fetch();
      } catch (e) {
        expect(e.name).to.equal('SyntaxError');
        done();
      }
    })();
  });

});
