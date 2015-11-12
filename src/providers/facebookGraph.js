import HttpJSONProvider from './http-json';

const accessToken = `${process.env.FB_APP_ID}|${process.env.FB_APP_SECRET}`;
const graphURL = 'https://graph.facebook.com/';

export default class FacebookGraphProvider extends HttpJSONProvider {

  constructor(pageId) {
    super(`${graphURL}${pageId}/posts?access_token=${accessToken}`);
  }

  async fetch() {
    let response = await super.fetch();
    return response.data;
  }

}
