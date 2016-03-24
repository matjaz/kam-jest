import HttpProvider from './http'

export default class HttpJSONProvider extends HttpProvider {

  async fetchUrl (url) {
    return JSON.parse(await super.fetchUrl(url))
  }

}
