import rp from 'request-promise'
import cheerio from 'cheerio'

import { toISODate } from '../util'

function req (options) {
  return rp ({
    ...options,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
    }
  })
}

async function fetchPageHtml (linkPath, options) {
  return req({
    ...options,
    url: `https://mbasic.facebook.com${linkPath}`,
  })
}

async function confirmCookiePage (data, options) {
  const $ = cheerio.load(data)
  const form = $('form')
  if (!form.length) {
    return
  }
  let body = form.find('input').toArray().map(x => `${encodeURIComponent($(x).attr('name'))}=${encodeURIComponent($(x).attr('value'))}`).join('&')
  body += '&accept_only_essential=1'

  return req({
    url: `https://mbasic.facebook.com${form.attr('action')}`,
    method: form.attr('method'),
    body,
    ...options,
  })
}

async function parsePhotoPage (linkPath, options) {
  const html = await fetchPageHtml(linkPath, options)
  const $ = cheerio.load(html)
  const image = $('a[target].sec').attr('href')
  return image
}

export default class FBBasicPostParser {

  jar = rp.jar()

  async parse (data) {
    const { jar } = this
    if (data.includes('/cookie/consent/')) {
      data = await confirmCookiePage(data, {jar})
    }
    if (!data) {
      return
    }
    const $ = cheerio.load(data)
    for (const el of $('article[data-ft]').toArray()) {
      const $story = $(el)
      const publishTime = FBBasicPostParser.articlePublishTime($story)
      if (publishTime) {
        var d = new Date(1000 * publishTime)
        if (d.getHours() > 6 && d.getHours() < 12) {
          const attachLinkList = $story.find('div > div > a').toArray().map(x => $(x).attr('href')).filter(x => x.includes('/photos/'))
          const offersImages = await Promise.all(attachLinkList.map(link => parsePhotoPage(link, {jar})))
          return {
            [toISODate(d)]: {
              offersImages
            }
          }
        }
      }
    }
  }

  async parseData (data) {
    if (data.includes('/cookie/consent/')) {
      data = await confirmCookiePage(data, {jar: this.jar})
    }
    if (data) {
      const $ = cheerio.load(data)
      return {
        name: $('#m-timeline-cover-section h1 span').text()
      }
    }
  }

  static articleData (articleEl) {
    try {
      const fbData = articleEl.attr('data-ft')
      return JSON.parse(fbData)
    } catch (e) {
    }
  }

  static articlePublishTime (articleEl) {
    const raw = FBBasicPostParser.articleData(articleEl)
    if (raw) {
      const pageInsights = raw.page_insights && raw.page_insights[raw.page_id]
      const postContext = pageInsights && pageInsights.post_context
      return postContext && postContext.publish_time
    }
  }
}
