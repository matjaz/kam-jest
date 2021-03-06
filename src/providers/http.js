import rp from 'request-promise'

export default class HttpProvider {
  constructor (url) {
    this.url = url
  }

  fetch () {
    return this.fetchUrl(this.url)
  }

  fetchUrl (options) {
    return rp(options)
  }
}
