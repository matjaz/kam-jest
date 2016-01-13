import {findDates, getPrice, getLines, toISODate, addToDate} from '../../util';
import {DAYS, OfferTypes} from '../../offers';

const types = ['MALICE', 'KOSILA'];

export default class SelihParser {

  isCandidate(post) {
    var message = post.message;
    return message && message.indexOf('MALICE') !== -1;
  }

  parse(post) {
    var week;
    var type;
    var startDate;
    var dayOffers;
    if (this.isCandidate(post)) {
      var lines = getLines(post.message);
      if (lines[0].startsWith(DAYS[0])) {
        startDate = toISODate(post.created_time);
      } else {
        let dates = findDates(lines.shift());
        startDate = dates.length ? toISODate(dates[0]) : '-';
      }
      lines.forEach(line => {
        var daysIndex;
        line = line.trim();
        if (types.includes(line.toUpperCase())) {
          type = normalizeType(line.toUpperCase());
        } else if ((daysIndex = DAYS.indexOf(line.toUpperCase())) !== -1) {
          let date = startDate === '-' ? '-' : addToDate(startDate, daysIndex);
          week = week || {};
          let dayData = week[date] || (week[date] = {offers: []});
          dayOffers = dayData.offers;
        } else if (line && dayOffers) {
          dayOffers.push({
            text: line.replace(/^\d+\.\)\s*/, '').replace(/\s*\d.*$/, ''),
            price: getPrice(line.slice(5)),
            type: type,
            // allergens: [],
            line: line
          });
        }
      });
      return week;
    }
  }
}

function normalizeType(type) {
  var offerType;
  switch (type) {
  case 'MALICE':
    offerType = 'MALICA';
    break;
  case 'KOSILA':
    offerType = 'KOSILO';
  }
  return OfferTypes.from(offerType);
}
