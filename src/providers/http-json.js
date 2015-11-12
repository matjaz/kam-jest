import HttpProvider from './http';

export default class HttpJSONProvider extends HttpProvider {

  async fetch() {
    let response = await super.fetch();
    return JSON.parse(response);
  }

}
