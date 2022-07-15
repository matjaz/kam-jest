import rp from 'request-promise'

export default class BrowserProvider {
  constructor (params) {
    this.params = params
  }

  fetch () {
    return rp({
      method: 'POST',
      uri: process.env.BROWSER_PROVIDER_URL,
      body: this.params,
    })
  }

}
