import HttpProvider from '../../providers/http'
import Parser from './parser'

const URL = 'http://www.centerstrike.si/index.php/2013-12-24-15-58-47/2013-12-24-16-01-39?tmpl=component&print=1&page='

export function provider () {
  return new HttpProvider(URL)
}

export function parser () {
  return new Parser()
}

export function data () {
  return {
    name: 'Bowling center Strike',
    location: {
      lat: 46.5291684,
      lon: 15.6578444
    }
  }
}
