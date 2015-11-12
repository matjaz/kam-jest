import rp from 'request-promise';

export default class HttpProvider {

  constructor(url) {
    this.url = url;
  }

  fetch() {
    return rp(this.url);
  }
}
