import {readdirSync} from 'fs';
import {getValue, distance as calcDistance} from './util';

const RESTAURANTS = readdirSync(`${__dirname}/restaurants`)
                      .map(x => x.replace(/\.js$/, ''));

export function getRestaurant(restaurantId) {
  try {
    return require(`./restaurants/${restaurantId}`);
  } catch (e) {
    throw new Error(`Restaurant not found: ${restaurantId}`);
  }
}

export function getRestaurants(args) {
  var {id, loc, distance} = args;
  var ids;
  if (!loc && 'distance' in args) {
    throw new Error('loc argument is mandatory, when using distance');
  }
  var id = getValue(id);
  if (id) {
    getRestaurant(id.value); // verify id exists
    if (!id.not) {
      ids = [id.value];
    }
  }
  if (!ids) {
    ids = RESTAURANTS;
  }
  if (id && id.not) {
    ids = ids.filter(x => x !== id.value);
  }
  var restaurants = ids.map(id => ({
    ...getRestaurant(id).data(),
    id,
  }));
  if (loc) {
    restaurants.forEach(r => {
      var {location} = r;
      r.distance = calcDistance(loc.lat, loc.lon, location.lat, location.lon);
    });
    if (distance != null) {
      restaurants = restaurants.filter(r => r.distance <= distance);
    }
  }
  return restaurants;
}
