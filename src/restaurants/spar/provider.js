import rp from 'request-promise'

const URL = 'https://www.spar.si/sl_SI/aktualno/restavracija-interspar/tedenska-sezonska-jed.html'

export default class SparProvider {

  async fetch () {
    var base = await rp(URL)
    var match = base.match(/href="(.*?pdf)"/)
    if (match) {
      return await rp({
        uri: `https://www.spar.si${match[1]}`,
        encoding: null
      })
    }
  }
}
