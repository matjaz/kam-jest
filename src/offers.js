
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


export async function getDailyOffers(restaurantId, args) {
  var {date} = args;
  var offers = await findOffers(restaurantId);
  var dates = date ? [date] : Object.keys(offers);
  return dates.map(date => ({
    offers: offers[date] && offers[date].offers || [],
    date,
  }));
}


async function findOffers(restaurantId) {
  var dataSource = getDataSource(restaurantId);
  var args = dataSource.provider.args;
  var provider = new dataSource.provider.fn(args[0], args[1], args[2], args[3]);
  var posts = await provider.fetch();
  return extractOffers(posts, new dataSource.parser);
}


function extractOffers(posts, parser) {
  for (let post of posts) {
    var offers = parser.parse(post);
    if (offers) {
      return offers;
    }
  }
}
