import HttpProvider from '../../providers/http'
import Parser from './parser'

export function provider () {
  return new HttpProvider('http://www.deponcho.si/index.php?option=com_content&view=article&id=44&Itemid=43')
}

export function parser () {
  return new Parser()
}

export function data () {
  return {
    name: 'El restaurante de Poncho',
    location: {
      lat: 46.4240923,
      lon: 15.8811631
    }
  }
}
