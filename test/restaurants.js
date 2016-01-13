import {expect} from 'chai';

import {getRestaurant, getRestaurants} from '../src/restaurants';
import FacebookGraphProvider from '../src/providers/facebookGraph';
import Selih from '../src/restaurants/selih/parser';

describe('getRestaurant', () => {

  it('should return provider & parser', () => {
    var restaurant = getRestaurant('selih');
    expect(restaurant)
      .to.have.property('provider')
      .that.is.an.instanceof(Function);
    expect(restaurant)
      .to.have.property('parser')
      .that.is.an.instanceof(Function);
    expect(restaurant.provider())
      .that.is.an.instanceof(FacebookGraphProvider);
    expect(restaurant.parser())
      .that.is.an.instanceof(Selih);
  });

  it('should return error for invalid id', () => {
    var fn = () => getRestaurant('404');
    expect(fn).to.throw('Restaurant not found: 404');
  });

});

describe('getRestaurants', () => {

  it('should get all restaurants', () => {
    var list = getRestaurants({});
    expect(list).to.be.an('array');
    expect(list.length).to.be.above(5);
  });

  it('should return only one restaurant', () => {
    var list = getRestaurants({id: 'selih'});
    expect(list.length).to.equal(1);
  });

  it('should calculate distance when location is provided', () => {
    var list = getRestaurants({
      id: 'selih',
      loc: {
        lat: 46.522425,
        lon: 15.669608
      }
    });
    expect(list.length).to.equal(1);
    expect(list[0])
      .to.have.property('distance')
      .that.is.above(1);
  });

  it('should filter by lesser distance', () => {
    var list = getRestaurants({
      loc: {
        lat: 46.522425,
        lon: 15.669608
      },
      distance: 2
    });
    expect(list.length).is.above(1);
    list.forEach(r => {
      expect(r)
        .to.have.property('distance')
        .that.is.below(2);
    });
  });

  it('should throw error for invalid id', () => {
    var fn = () => getRestaurants({id: '404'});
    expect(fn).to.throw('Restaurant not found: 404');
  });

  it('should throw error when filtering by distance and loc is missing', () => {
    var fn = () => getRestaurants({
      distance: 0
    });
    expect(fn).to.throw('loc argument is mandatory, when using distance');
  });
});
