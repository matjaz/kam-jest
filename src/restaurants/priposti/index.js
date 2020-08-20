import FacebookMBasicProvider from '../../providers/facebookBasic'
import Parser from './parser'

export function provider () {
  return new FacebookMBasicProvider('Gostilna-pri-Pošti-285309012417238')
}

export function parser () {
  return new Parser()
}

export function data () {
  return {
    name: 'Gostilna Pri Pošti',
    location: {
      lat: 46.419496,
      lon: 15.872891
    }
  }
}
