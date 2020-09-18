import HttpProvider from '../../providers/http'
import Parser from './parser'

export function provider () {
  return new HttpProvider('https://m.restavracija-amfora.si/malice.php')
}

export function parser () {
  return new Parser()
}

export function data () {
  return {
    name: 'Restavracija Amfora',
    location: {
      lat: 46.4274049,
      lon: 15.882145
    }
  }
}
