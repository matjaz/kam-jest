import FacebookGraph from '../../providers/facebookGraph'
import Parser from './parser'

export function provider () {
  return new FacebookGraph('711185312277170')
}

export function parser () {
  return new Parser()
}

export function data () {
  return {
    name: 'Toscana',
    location: {
      lat: 46.5331699,
      lon: 15.664537
    }
  }
}
