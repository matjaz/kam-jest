import HttpProvider from './http'

export default class HttpJSONProvider extends HttpProvider {

  async fetch () {
    return JSON.parse(await super.fetch())
  }

}
