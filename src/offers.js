
import {dataSourceFactory} from './restaurants';

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
  if (!offers) {
    return [];
  }
  var dates = date ? [date] : Object.keys(offers);
  return dates.map(date => ({
    offers: offers[date] && offers[date].offers || [],
    date,
  }));
}


async function findOffers(restaurantId) {
  var dataSource = dataSourceFactory(restaurantId);
  var posts = await dataSource.provider.fetch();
  return extractOffers(posts, dataSource.parser);
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
