import {findDates, getPrice, getLines, toISODate} from '../util';
import {DAYS, OfferTypes} from '../offers';

export default class ToscanaParser {

  isCandidate(post) {
    var message = post.message;
    return message && message.indexOf('KOSILA') !== -1;
  }

  parse(post) {
    var week;
    var dayOffers;
    if (this.isCandidate(post)) {
      getLines(post.message).some(line => {
        line = line.trim();
        if (line.startsWith('Posebna')) {
          return true;
        }
        if (DAYS.some(day => line.toUpperCase().startsWith(day))) {
          var dates = findDates(line);
          var date = dates.length ? toISODate(dates[0]) : '-';
          if (!week) {
            week = {};
          }
          let dayData = week[date] || (week[date] = {offers: []});
          dayOffers = dayData.offers;
        } else if (line && dayOffers) {
          dayOffers.push({
            text: line.replace(/^\S+\s+/, '').replace(/[\u2026.]*\s*\d.*$/, ''),
            price: getPrice(line.slice(-10)),
            type: OfferTypes.KOSILO,
            // allergens: [],
            line: line
          });
        }
      });
      return week;
    }
  }

}
