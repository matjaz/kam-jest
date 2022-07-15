import HttpProvider from '../../providers/http'
import Parser from './parser'

const URL = 'https://www.okrepcevalnica-raj.si/'

export function provider () {
  return new HttpProvider(URL)
}

export function parser () {
  return new Parser()
}

export function data () {
  return {
    name: 'Okrepčevalnica Raj',
    location: {
      lat: 46.4279017,
      lon: 15.8809046,
    }
  }
}
