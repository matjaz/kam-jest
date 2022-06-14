import FBBasicImageParser from '../../parsers/fbBasicImage'

import { getLines, findDatesISO } from '../../util'
import { OfferTypes } from '../../offers'

export default class PriPostiParser extends FBBasicImageParser {
  async parse (data) {
    data = await super.parse(data)
    const dates = Object.keys(data)
    const currentDate = dates[0]
    const { offers } = data[currentDate]
    const { text } = offers[0]
    const lines = text && getLines(text)
    const type = OfferTypes.MALICA
    if (lines) {
      let week
      let offers = []
      let offerText = ''
      for (const text of lines) {
        const d = findDatesISO(text)[0]
        if (d === currentDate) {
          week = {
            [d]: {
              offers
            }
          }
          continue
        }
        if (week) {
          const lower = text.toLowerCase()
          if (lower.includes('dnevna') || lower.includes('juha')) {
            if (offerText) {
              offers.push({
                text: offerText.trim(),
                type,
              })
              offerText = ''
            }
          }
          if (lower.includes('stalna') || lower.includes(' ponudba')) {
            break
          }
          if (offerText) {
            offerText += ', '
          }
          offerText += text.replace(/,\s*$/, '').trim()
        }
      }
      if (offerText) {
        offers.push({
          text: offerText,
          type,
        })
      }
      if (offers.length) {
        return week
      }
    }
  }
}
