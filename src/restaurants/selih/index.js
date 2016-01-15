import FacebookGraph from '../../providers/facebookGraph'
import Parser from './parser'

export function provider () {
  return new FacebookGraph('170953879766724')
}

export function parser () {
  return new Parser()
}

export function data () {
  return {
    name: 'Šelih',
    location: {
      lat: 46.5480009,
      lon: 15.6547506
    }
  }
}
