import moment from 'moment'

export function findDates (str) {
  // dd. mm. yyyy
  var re = /(\d{1,2})\s?\.\s?(\d{1,2})\s?[.\s]\s?(\d{2,4})?/g
  var match
  var dates = []
  while ((match = re.exec(str))) {
    // moment() compatible (zero based month)
    dates.push({
      day: parseFloat(match[1]),
      month: parseFloat(match[2]) - 1,
      year: match[3] && parseFloat(match[3]) || undefined
    })
  }
  if (dates.length === 2 && !dates[0].year && dates[1].year) {
    dates[0].year = dates[1].year
  }
  return dates
}

export function findDatesISO (str) {
  return findDates(str).map(toISODate)
}

export function getPrice (line) {
  var match = line.match(/\d+(?:[,.]\s?\d{2})?/)
  if (match) {
    return parseFloat(match[0].replace(',', '.').replace(/\s/, ''))
  }
}

export function getLines (str) {
  return str.split(/\r\n|\r|\n/)
}

export function toISODate (date) {
  return moment(date).format('YYYY-MM-DD')
}

export function addToDate (date, days) {
  return toISODate(moment(date).add(days, 'days'))
}

export function getValue (value, mapper) {
  if (value) {
    let not = value.charAt(0) === '!'
    if (not) {
      value = value.slice(1)
    }
    return {
      value: mapper ? mapper(value) : value,
      not
    }
  }
}

const PI180 = 0.017453292519943295    // Math.PI / 180
export function distance (lat1, lon1, lat2, lon2) {
  var a = 0.5 - Math.cos((lat2 - lat1) * PI180) / 2 +
          Math.cos(lat1 * PI180) * Math.cos(lat2 * PI180) *
          (1 - Math.cos((lon2 - lon1) * PI180)) / 2
  return 12742 * Math.asin(Math.sqrt(a)) // 2 * R R = 6371 km
}

export function requiredInPair (pair) {
  const keys = Object.keys(pair)
  if (keys.length !== 2) {
    throw new Error('Pair should contain exactly two items')
  }
  const [a, b] = [pair[keys[0]], pair[keys[1]]]
  if (a == null && b != null || a != null && b == null) {
    throw new Error(`required pair ${keys}`)
  }
}
