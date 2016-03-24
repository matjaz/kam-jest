import HttpJSONProvider from './http-json'

export default class GostilneProvider extends HttpJSONProvider {

  constructor (id) {
    if (!id) {
      throw new Error('Missing id')
    }
    super(`http://www.gostilne.si/jsonGostilne.php?action2=hash&pos=46%2C15&hash=${id}`)
  }

}
