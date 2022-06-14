import { getLines, ocr, toISODate } from '../../util'
import { OfferTypes } from '../../offers'
import FBBasicImageParser from '../../parsers/fbBasicImage'

export default class RozikaParser extends FBBasicImageParser {
  async parse (data) {
    data = await super.parse(data)
    if (!data) {
      return
    }
    const dates = Object.keys(data)
    const currentDate = dates[0]
    const { offers } = data[currentDate]
    const { text } = offers[0]
    const lines = text && getLines(text)
    if (lines) {
      let offers = []
      const type = OfferTypes.MALICA
      const week = {
        [currentDate]: {
          ...data[currentDate],
          offers,
        }
      }
      let state = 0 // 0=idle, 1=daily, 2=regular, 3=end
      for (const text of lines) {
        const lowerText = text.toLowerCase()
        if (state === 0 && (lowerText.includes('dnevna') || lowerText.includes('ponudba'))) {
          state = 1
          continue
        }
        if (state === 1 && (lowerText.includes('stalna') || lowerText.includes('ponudba'))) {
          break
          // state = 2
          // continue
        }
        if (state === 1 && text.length > 10) {
          offers.push({
            text,
            type
          })
        }
      }
      if (offers.length) {
        return week
      }
    }
  }
}
