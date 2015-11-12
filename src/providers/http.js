import request from 'request';

export default class HttpProvider {

  constructor(url) {
    this.url = url;
  }

  fetch() {
    return new Promise((resolve, reject) => {
      request(this.url, function (error, response, body) {
        if (body) {
          resolve(body);
        } else {
          console.error(error, body);
          if (!error) {
            error = new Error('Invalid response');
            error.response = response;
            error.body = body;
          }
          reject(error);
        }
      });
    });
  }
}
