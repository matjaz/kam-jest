import rp from 'request-promise'
import cheerio from 'cheerio'

import { toISODate } from '../util'

const fetchPageHtml = async (linkPath) => {
  const url = `https://mbasic.facebook.com${linkPath}`
  return rp({
      url,
      headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
      },
  });
}

async function parsePhotoPage (linkPath) {
  const html = await fetchPageHtml(linkPath)
  const $ = cheerio.load(html)
  const image = $('#MPhotoContent div.desc.attachment > span > div > span > a[target=_blank].sec').attr('href')
  return image
}

export default class FBBasicPostParser {
  async parse(data) {
    const $ = cheerio.load(data)
    const stories = $('article[data-ft]')
    const story = stories[0]
    try {
      const $story = $(story)
      const fbData = $story.attr('data-ft')
      const raw = JSON.parse(fbData)
      const page_insights = raw.page_insights && raw.page_insights[raw.page_id]
      const post_context = page_insights && page_insights.post_context
      const publish_time = post_context && post_context.publish_time
      if (publish_time) {
        const attachLinkList = $story.find('div > div > a').toArray().map(x => $(x).attr('href'))
        const offersImages = await Promise.all(attachLinkList.map(link => parsePhotoPage(link)))
        const date = toISODate(1000 * publish_time)
        return {
          [date]: {
            offersImages,
          }
        }
      }
    } catch (e) {

    }
  }

  parseData (data) {
    const $ = cheerio.load(data)
    return {
      name: $('#m-timeline-cover-section h1 span').text(),
    }
  }

}
