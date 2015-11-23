
import {dataSourceFactory} from './restaurants';

export const DAYS = ['PONEDELJEK', 'TOREK', 'SREDA', 'ČETRTEK', 'PETEK'];
export const ALL_DAYS = DAYS.concat('SOBOTA', 'NEDELJA');
export const MONTHS = [
  'JANUAR',
  'FEBRUAR',
  'MAREC',
  'APRIL',
  'MAJ',
  'JUNIJ',
  'JULIJ',
  'AVGUST',
  'SEPTEMBER',
  'OKTOBER',
  'NOVEMBER',
  'DECEMBER'
];

export const OfferTypes = {
  KOSILO: 1,
  MALICA: 2,
  ZLICA: 3,
  VEGE: 4,
  from(val) {
    if (typeof this[val] == 'number') {
      return this[val];
    }
    throw new Error(`Invalid offer type value: ${val}`);
  }
};


export async function getDailyOffers(restaurantId, args) {
  var filterFn;
  var {date} = args;
  var type = getType(args.type);
  var allOffers = await findOffers(restaurantId);
  if (!allOffers) {
    return [];
  }
  var dates = date ? [date] : Object.keys(allOffers);
  if (type) {
    filterFn = type.not ?
      offer => {
        return offer.type !== type.value;
      }
      :
      offer => {
        return offer.type === type.value;
      };
  }
  return dates.map(date => {
    var offers = allOffers[date] && allOffers[date].offers || [];
    if (filterFn && offers.length) {
      offers = offers.filter(filterFn);
    }
    return {
      offers,
      date,
    };
  });
}


async function findOffers(restaurantId) {
  var dataSource = dataSourceFactory(restaurantId);
  var posts = await dataSource.provider.fetch();
  if (posts) {
    return extractOffers(posts, dataSource.parser);
  }
}


function extractOffers(posts, parser) {
  if (!Array.isArray(posts)) {
    posts = [posts];
  }
  for (let post of posts) {
    let offers = parser.parse(post);
    if (offers) {
      return offers;
    }
  }
}

function getType(type) {
  if (type) {
    let not = false;
    if (type.charAt(0) === '!') {
      type = type.slice(1);
      not = true;
    }
    return {
      value: OfferTypes.from(type),
      not
    };
  }
}
