import {distance as calcDistance} from './util';

import HttpProvider from './providers/http';
import FacebookGraph from './providers/facebookGraph';
import SparProvider from './providers/spar';

import Selih from './parsers/selih';
import Toscana from './parsers/toscana';
import Foglez from './parsers/foglez';
import Strike from './parsers/strike';
import DaNoi from './parsers/da-noi';
import Spar from './parsers/spar';

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
  },
  strike: {
    provider: {
      fn: HttpProvider,
      args: ['http://www.centerstrike.si/index.php/2013-12-24-15-58-47/2013-12-24-16-01-39?tmpl=component&print=1&page=']
    },
    parser: Strike,
    data: {
      name: 'Bowling center Strike',
      location: {
        lat: 46.5291684,
        lon: 15.6578444
      }
    }
  },
  'da-noi': {
    provider: {
      fn: HttpProvider,
      args: ['http://www.da-noi.si']
    },
    parser: DaNoi,
    data: {
      name: 'Da Noi',
      location: {
        lat: 46.539322,
        lon: 15.640531
      }
    }
  },
  spar: {
    provider: {
      fn: SparProvider
    },
    parser: Spar,
    data: {
      name: 'Spar restavracija',
      location: {
        lat: 46.554280,
        lon: 15.653026
      }
    }
  }
};


export function getRestaurants(args) {
  var {id, loc, distance} = args;
  var ids;
  if (!loc && 'distance' in args) {
    throw new Error('loc argument is mandatory, when using distance');
  }
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
    provider: new provider.fn(...(provider.args || [])),
    parser: new parser
  };
}
