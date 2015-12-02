import htmlToText from 'html-to-text';

import {getLines, getPrice, toISODate} from '../util';
import {ALL_DAYS, MONTHS, OfferTypes} from '../offers';

export default class DaNoiParser {

  parse(pageSource) {
    var offers;
    var dayOffers;
    var type;
    var price;
    var offerText = '';
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

    function addOffer() {
      // add previous offer
      if (dayOffers && offerText) {
        dayOffers.push({
          text: offerText.trim(),
          price: price,
          type: type,
          // allergens: []
        });
        offerText = '';
      }
    }

    getLines(text).some(line => {
      line = line.trim();
      if (line.charAt(0) === '*') {
        // end
        addOffer();
        return true;
      }
      if (ALL_DAYS.some(day => line.toUpperCase().startsWith(day.slice(0, 3)))) {
        let date = extractDate(line);
        if (date) {
          addOffer();
          offers = offers || {};
          if (offers[date]) {
            return true;
          }
          dayOffers = [];
          offers[date] = {offers: dayOffers};
        }
      } else if (dayOffers && (line.toUpperCase().startsWith('MALICA') || line.toUpperCase().startsWith('MENI NA ŽLICO'))) {
        addOffer();
        type = OfferTypes.from(line.toUpperCase().startsWith('MENI NA ŽLICO') ? 'ZLICA' : 'MALICA');
        price = getPrice(line);
      } else if (dayOffers && line.toUpperCase().startsWith('PRVI MENI')) {
        addOffer();
        type = OfferTypes.from('KOSILO');
        price = getPrice(line);
      } else if (line && dayOffers) {
        offerText += `${line} `;
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
