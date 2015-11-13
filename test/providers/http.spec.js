import nock from 'nock';
import {expect} from 'chai';

import HttpProvider from '../../src/providers/http';

describe('Http provider', () => {

  it('should make http request', (done) => {
    nock('http://www.example.com')
      .get('/')
      .reply(200, 'ok');

    new HttpProvider('http://www.example.com').fetch().then(resp => {
      expect(resp).to.equal('ok');
      done();
    });
  });

  it('should fail on 404', (done) => {
    nock('http://www.example.com')
      .get('/')
      .reply(404);

    new HttpProvider('http://www.example.com').fetch().catch(err => {
      expect(err.statusCode).to.equal(404);
      done();
    });
  });

});
