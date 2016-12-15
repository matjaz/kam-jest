import FacebookGraph from '../../providers/facebookGraph'
import Parser from './parser'

export function provider () {
  return new FacebookGraph('209961345841912')
}

export function parser () {
  return new Parser()
}

export function data () {
  return {
    name: 'Gostilna Pri Ovinku',
    location: {
      lat: 46.4289342,
      lon: 15.8858138
    }
  }
}
