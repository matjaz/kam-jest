import htmlToText from 'html-to-text';

import {getLines, getPrice, toISODate} from '../util';
import {ALL_DAYS, MONTHS, OfferTypes} from '../offers';

export default class DaNoiParser {

  parse(pageSource) {
    var offers;
    var dayOffers;
    var type;
    var price;
    var wasTypeLine;
    var text = htmlToText.fromString(pageSource, {
      wordwrap: Infinity
    });
    var posStart = text.indexOf('PONUDBA DNEVA');
    if (posStart !== -1) {
      var posEnd = text.indexOf('TUDENTSKI BONI');
      if (posEnd > posStart) {
        text = text.slice(posStart, posEnd);
      } else {
        text = text.slice(posStart);
      }
    }

    getLines(text).some(line => {
      line = line.trim();
      if (line.charAt(0) === '*') {
        // end
        return true;
      }
      if (ALL_DAYS.some(day => line.toUpperCase().startsWith(day.slice(0, 3)))) {
        let date = extractDate(line);
        if (date) {
          offers = offers || {};
          if (offers[date]) {
            return true;
          }
          dayOffers = [];
          offers[date] = {offers: dayOffers};
        } else {
          dayOffers = null;
        }
      } else if (dayOffers && (line.toUpperCase().startsWith('MALICA') || line.toUpperCase().startsWith('MENI NA ŽLICO'))) {
        type = OfferTypes.from('MALICA');
        price = getPrice(line);
        wasTypeLine = true;
      } else if (dayOffers && line.toUpperCase().startsWith('PRVI MENI')) {
        type = OfferTypes.from('KOSILO');
        price = getPrice(line);
        wasTypeLine = true;
      } else if (line && dayOffers && wasTypeLine) {
        wasTypeLine = false;
        dayOffers.push({
          text: line,
          price: price,
          type: type,
          // allergens: []
        });
      }
    });
    return offers;
  }
}

function extractDate(str) {
  var match = str.match(/(\d+)\s*\.\s*(\w+)$/);
  var monthIndex = match && MONTHS.indexOf(match[2].toUpperCase());
  if (match && monthIndex !== -1) {
    return toISODate({
      day: parseFloat(match[1]),
      month: monthIndex
    });
  }
}
