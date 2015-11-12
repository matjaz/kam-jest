import {distance as calcDistance} from './util';

import FacebookGraph from './providers/facebookGraph';

import Selih from './parsers/selih';
import Toscana from './parsers/toscana';
import Foglez from './parsers/foglez';

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
  foglez: {
    provider: {
      fn: FacebookGraph,
      args: ['1374880122759255']
    },
    parser: Foglez,
    data: {
      name: 'Picerija, gril in bar Foglež',
      location: {
        lat: 46.499744,
        lon: 15.701672
      }
    }
  }
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

function getDataSource(restaurantId) {
  var dataSource = DataSource[restaurantId];
  if (!dataSource) {
    throw new Error(`Restaurant not found: ${restaurantId}`);
  }
  return dataSource;
}

export function dataSourceFactory(restaurantId) {
  var {provider, parser} = getDataSource(restaurantId);
  return {
    provider: new provider.fn(...provider.args),
    parser: new parser
  };
}
