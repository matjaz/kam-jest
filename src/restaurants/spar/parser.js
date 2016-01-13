import PdfParser from '../../parsers/pdf';
import {findDates, getPrice, toISODate} from '../../util';
import {ALL_DAYS, OfferTypes} from '../../offers';

export default class SparParser extends PdfParser {

  async parse(pdfBuffer) {
    var pdf = await super.parse(pdfBuffer);
    var lines = this.getLines(pdf);
    var offerText = '';
    var offers;
    var dayOffers;
    var type;
    var price;
    var state;
    var isMalica;
    var isZlica;

    function addOffer() {
      // add previous offer
      if (offerText) {
        dayOffers.push({
          text: offerText.trim(),
          price: price,
          type: type,
          // allergens: []
        });
        offerText = '';
      }
    }

    lines.some(line => {
      line = line.trim();
      if (line.toUpperCase().startsWith('TEDEN ')) {
        // end
        addOffer();
        return true;
      }
      if (ALL_DAYS.some(day => line.toUpperCase().startsWith(day))) {
        let dates = findDates(line);
        if (dates.length) {
          addOffer();
          var date = toISODate(dates[0]);
          offers = offers || {};
          if (offers[date]) {
            return true;
          }
          dayOffers = [];
          offers[date] = {offers: dayOffers};
        } else {
          dayOffers = null;
        }
      } else if (dayOffers && (
        (isMalica = line.toUpperCase().startsWith('MENU ')) || 
        (isZlica = line.toUpperCase().startsWith('ENOLONČNICA')) || 
        line.toUpperCase().startsWith('VEGE PONUDBA')
      )) {
        addOffer();
        type = OfferTypes.from(isMalica ? 'MALICA' : (isZlica ? 'ZLICA' : 'VEGE'));
        state = 'hasType';
      } else if (state === 'hasType') {
        price = getPrice(line);
        state = 'hasPrice';
      } else if (state === 'hasPrice') {
        offerText += `${line} `;
      }
    });
    return offers;
  }

}
