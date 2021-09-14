import { getLines, toISODate } from '../../util'
import { OfferTypes } from '../../offers'

export default class RozikaParser {
  parse (data) {
    const text = data.ParsedResults[0] && data.ParsedResults[0].ParsedText
    const lines = text && getLines(text)
    if (lines) {
      let offers = []
      const type = OfferTypes.MALICA
      const date = toISODate(new Date())
      const offersImages = data.imageUrl && [data.imageUrl]
      const week = {
        [date]: {
          offers,
          offersImages,
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
