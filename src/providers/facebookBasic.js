import HttpProvider from './http'

export default class FacebookMBasicProvider extends HttpProvider {
  constructor (pageId) {
    super(`https://mbasic.facebook.com/${pageId}`)
  }

  fetch () {
    return this.fetchUrl({
      url: this.url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
      }
    })
  }
}
