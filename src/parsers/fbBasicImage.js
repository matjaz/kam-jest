import { OfferTypes } from '../offers'
import { ocr } from '../util'
import FBBasicPostParser from './fbBasicPost'

export default class FBBasicImageParser extends FBBasicPostParser {
  async parse (data) {
    const postData = await super.parse(data)
    if (!postData) {
      return
    }
    const dates = Object.keys(postData)
    const date = dates[0]
    const postDayData = postData[date]
    const imageUrl = postDayData && postDayData.offersImages && postDayData.offersImages[0]
    if (!imageUrl) {
      return
    }
    const ocrData = await ocr(imageUrl)
    if (ocrData) {
      const type = OfferTypes.MALICA
      const text = ocrData.ParsedResults[0] && ocrData.ParsedResults[0].ParsedText
      return {
        [date]: {
          ...postDayData,
          offers: [{
            text,
            type,
          }],
        }
      }
    }
  }
}
