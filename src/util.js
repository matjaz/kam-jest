import moment from 'moment';

export function findDates(str) {
  // dd. mm. yyyy
  var re = /(\d{1,2})\s?\.\s?(\d{1,2})(?:\s?\.\s?(\d{2,4}))/g;
  var match;
  var dates = [];
  while (match = re.exec(str)) {
    // moment() compatible (zero based month)
    dates.push({
      day: parseFloat(match[1]),
      month: parseFloat(match[2]) - 1,
      year: match[3] && parseFloat(match[3]) || undefined
    });
  }
  return dates;
}

export function getPrice(line) {
  var match = line.match(/\d+(?:[,.]\d{2})?/);
  if (match) {
    return parseFloat(match[0].replace(',', '.'));
  }
}

export function getLines(str) {
  return str.split(/\r\n|\r|\n/);
}

export function toISODate(date) {
  return moment(date).format('YYYY-MM-DD');
}

export function addToDate(date, days) {
  return toISODate(moment(date).add(days, 'days'));
}

const PI180 = 0.017453292519943295;    // Math.PI / 180
export function distance(lat1, lon1, lat2, lon2) {
  var a = 0.5 - Math.cos((lat2 - lat1) * PI180)/2 + 
          Math.cos(lat1 * PI180) * Math.cos(lat2 * PI180) * 
          (1 - Math.cos((lon2 - lon1) * PI180))/2;
  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}
