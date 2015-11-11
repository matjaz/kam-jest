import request from 'request';

const accessToken = `${process.env.FB_APP_ID}|${process.env.FB_APP_SECRET}`;
const graphURL = 'https://graph.facebook.com/';

export default class FacebookGraphProvider {

  constructor(pageId) {
    this.pageId = pageId;
  }

  fetch() {
    return new Promise((resolve, reject) => {
      var url = `${graphURL}${this.pageId}/posts?access_token=${accessToken}`;
      request(url, function (error, response, body) {
        var json;
        try {
          json = JSON.parse(body);
        } catch(e) {
          console.error(e);
        }
        if (json && json.data) {
          resolve(json.data);
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
