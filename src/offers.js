
import {getDataSource} from './restaurants';

export const DAYS = ['PONEDELJEK', 'TOREK', 'SREDA', 'ČETRTEK', 'PETEK'];

export const OfferTypes = {
  KOSILO: 1,
  MALICA: 2,
  from(val) {
    if (typeof this[val] == 'number') {
      return this[val];
    }
    throw new Error(`Invalid enum value: ${val}`);
  }
};


export function getDailyOffers(restaurantId, args) {
  var {date} = args;
  return findOffers(restaurantId).then(offers => {
    const dates = date ? [date] : Object.keys(offers);
    return dates.map(date => ({
      offers: offers[date] && offers[date].offers || [],
      date,
    }));
  });
}


function findOffers(restaurantId) {
  var dataSource = getDataSource(restaurantId);
  var args = dataSource.provider.args;
  var provider = new dataSource.provider.fn(args[0], args[1], args[2], args[3]);
  return provider.fetch().then(posts => extractOffers(posts, new dataSource.parser));
}


function extractOffers(posts, parser) {
  var offers;
  posts.some(post => {
    var r = parser.parse(post);
    if (r) {
      offers = r;
      return true;
    }
  });
  return offers;
}
