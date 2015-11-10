import {distance as calcDistance} from './util';

import FacebookGraph from './providers/facebookGraph';

import Selih from './parsers/selih';
import Toscana from './parsers/toscana';

const DataSource = {
  toscana: {
    provider: {
      fn: FacebookGraph,
      args: ['711185312277170']
    },
    parser: Toscana,
    data: {
      name: 'Toscana',
      location: {
        lat: 46.5331699,
        lon: 15.664537,
      }
    },
  },
  selih: {
    provider: {
      fn: FacebookGraph,
      args: ['170953879766724']
    },
    parser: Selih,
    data: {
      name: 'Šelih',
      location: {
        lat: 46.5480009,
        lon: 15.6547506,
      }
    },
  },
};


export function getRestaurants(args) {
  var {id, loc, distance} = args;
  var ids;
  if (id) {
    getDataSource(id); // verify id exists
    ids = [id];
  } else {
    ids = Object.keys(DataSource);
  }
  var restaurants = ids.map(id => ({
      ...DataSource[id].data,
      id,
  }));
  if (loc && distance != null) {
    restaurants = restaurants.filter(r => {
      var {location} = r;
      var dist = calcDistance(loc.lat, loc.lon, location.lat, location.lon);
      r.distance = dist;
      return dist <= distance;
    });
  }
  return restaurants;
}

export function getDataSource(restaurantId) {
  var dataSource = DataSource[restaurantId];
  if (!dataSource) {
    throw new Error(`Restaurant not found: ${restaurantId}`);
  }
  return dataSource;
}
