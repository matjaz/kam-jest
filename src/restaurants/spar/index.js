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
    name: 'Spar restavracija',
    location: {
      lat: 46.554280,
      lon: 15.653026
    }
  }
}
