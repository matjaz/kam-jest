import HttpJSONProvider from './http-json'

export default class WoltProvider extends HttpJSONProvider {
  constructor (id) {
    const baseUrl = `https://restaurant-api.wolt.com/v4/venues/slug/${id}`
    super(`${baseUrl}/menu`)
    this.dataUrl = baseUrl
  }

  async fetchData () {
    return JSON.parse(await this.fetchUrl(this.dataUrl))
  }
}
