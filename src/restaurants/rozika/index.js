import Provider from './provider'
import Parser from './parser'

export function provider () {
  return new Provider()
}

export function parser () {
  return new Parser()
}

export function data () {
  return {
    name: 'Gostilna Rozika',
    location: {
      lat: 46.4213181,
      lon: 15.8701297,
    }
  }
}
