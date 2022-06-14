import FacebookMBasicProvider from '../../providers/facebookBasic'
import Parser from './parser'

export function provider () {
  return new FacebookMBasicProvider('GostilnaRozika')
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
