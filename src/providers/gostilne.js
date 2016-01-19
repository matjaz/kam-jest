import HttpProvider from './http'

export default class GostilneProvider extends HttpProvider {

  constructor (id) {
    if (!id) {
      throw new Error('Missing id')
    }
    super(`http://www.gostilne.si/${id}.html`)
  }

}
