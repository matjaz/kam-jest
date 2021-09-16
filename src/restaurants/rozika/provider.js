import rp from 'request-promise'
const ocrSpace = require('ocr-space-api-wrapper')

export default class RozikaProvider {

  async fetch () {
    try {
      const browserResult = await rp({
        method: 'POST',
        uri: process.env.BROWSER_PROVIDER_URL,
        body: 'text=rozika',
      })
      const jsonData = JSON.parse(browserResult)
      if (jsonData.images && jsonData.images[0]) {
        const imageUrl = jsonData.images[0]
        const ocrResult = await ocrSpace(imageUrl, {
          language: 'slv',
        })
        if (ocrResult && ocrResult.OCRExitCode === 1) {
          ocrResult.imageUrl = imageUrl
          return ocrResult
        }
      }
    } catch (err) {
      console.err(err)
    }
  }

}
