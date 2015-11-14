import {expect} from 'chai';

import {findDates, getPrice, getLines, toISODate, addToDate, distance, requiredInPair} from '../src/util';

describe('findDates', () => {

  it('should return empty array on empty string', () => {
    var dates = findDates('');
    expect(dates).to.eql([]);
  });

  it('should find dates', () => {
    var dates = findDates('MALICE IN KOSILA 2.11.2015 - 6.11.2015\n');
    expect(dates).to.eql([{
      day: 2,
      month: 10,
      year: 2015
    }, {
      day: 6,
      month: 10,
      year: 2015
    }]);

    dates = findDates('PONEDELJEK, 12. 10. 2015\n');
    expect(dates).to.eql([{
      day: 12,
      month: 9,
      year: 2015
    }]);

    dates = findDates('TEDENSKA PONUDBA MALIC // Od 28.9.2015 - 2.10.2015');
    expect(dates).to.eql([{
      day: 28,
      month: 8,
      year: 2015
    }, {
      day: 2,
      month: 9,
      year: 2015
    }]);

    dates = findDates('OD 09.11.-13.11.2015 med 10 in 14 uro:');
    expect(dates).to.eql([{
      day: 9,
      month: 10,
      year: 2015
    }, {
      day: 13,
      month: 10,
      year: 2015
    }]);

    dates = findDates('MALICE Od 28.9,2015');
    expect(dates).to.eql([]);
  });

});

describe('getPrice', () => {

  it('should get price', () => {
    var price = getPrice('text 13.37 text');
    expect(price).to.be.equal(13.37);
  });

  it('should get price with comma decimal', () => {
    var price = getPrice('text 13,37E text');
    expect(price).to.be.equal(13.37);
  });

  it('should get first price', () => {
    var price = getPrice('text 13.37E text 42.15 text');
    expect(price).to.be.equal(13.37);
  });

  it('should return undefined on no match', () => {
    var price = getPrice('text');
    expect(price).to.be.an('undefined');
  });

});

describe('getLines', () => {

  it('should return an empty array on empty string', () => {
    var lines = getLines('');
    expect(lines).to.be.eql(['']);
  });

  it('should return an empty array on empty string', () => {
    var lines = getLines('first\nsecond\r\nthird line\r fourth \n');
    expect(lines).to.be.eql([
      'first',
      'second',
      'third line',
      ' fourth ',
      ''
    ]);
  });

});

describe('toISODate', () => {

  it('should return ISO date', () => {
    var date = toISODate({
      day: 29,
      month: 1,
      year: 2012
    });
    expect(date).to.be.equal('2012-02-29');
  });

});


describe('addToDate', () => {

  it('should add 2 days', () => {
    var date = addToDate({
      day: 29,
      month: 1,
      year: 2012
    }, 2);
    expect(date).to.be.equal('2012-03-02');
  });

});

describe('distance', () => {

  it('should calculate distance', () => {
    var dist = distance(46.5480009, 15.6547506, 46.522425, 15.669608);
    expect(dist).to.be.closeTo(3, 0.1);
  });

});

describe('requiredInPair', () => {

  it('should not throw if both values are set', () => {
    var fn = () => requiredInPair({
      a: 1,
      b: 2
    });
    expect(fn).not.to.throw();
  });

  it('should not throw if both values are not set', () => {
    var fn = () => requiredInPair({
      a: undefined,
      b: null
    });
    expect(fn).not.to.throw();
  });

  it('should throw when invalid pair', () => {
    var fn = () => requiredInPair({
      a: 1
    });
    expect(fn).to.throw('Pair should contain exactly two items');
  });

  it('should throw when first key is undefined', () => {
    var fn = () => requiredInPair({
      a: undefined,
      b: 2
    });
    expect(fn).to.throw('required pair a,b');
  });

  it('should throw when second key is undefined', () => {
    var fn = () => requiredInPair({
      a: 1,
      b: undefined
    });
    expect(fn).to.throw('required pair a,b');
  });

});
