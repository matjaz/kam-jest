import cheerio from 'cheerio'
import FBBasicPostParser from '../../parsers/fbBasicPost'

import { toISODate, getLines } from '../../util'
import { OfferTypes } from '../../offers'

export default class PriPostiParser {
  parse (data) {
    const $ = cheerio.load(data)
    const type = OfferTypes.MALICA
    const article = $('article').first()
    const publishTime = FBBasicPostParser.articlePublishTime(article)
    if (!publishTime) {
      return
    }
    const date = toISODate(1000 * publishTime)
    var offers = []
    const week = {
      [date]: {
        offers
      }
    }
    article.find('header+div p').each(function (i) {
      const dd = $(this).html().replace(/<br\s*\/?>/g, '\n')
      const ell = cheerio.load(dd)
      const txt = ell.text().trim()
      if (/^\d/.test(txt)) {
        const lines = getLines(txt).map(l => l.trim())
        lines.forEach(line => {
          const match = line.match(/^(\d\.?\s*)/)
          if (match) {
            const text = line.slice(match[1].length)
            offers.push({
              text,
              type
            })
          }
        })
      }
    })
    if (offers.length) {
      return week
    }
  }
}
