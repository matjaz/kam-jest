import rp from 'request-promise'
const ocrSpace = require('ocr-space-api-wrapper')

export default class RozikaProvider {

  async fetch () {
    try {
      const browserResult = await rp({
        method: 'POST',
        uri: process.env.BROWSER_PROVIDER_URL,
        body: 'text=rozika&type=json',
      })
      const jsonData = JSON.parse(browserResult)
      if (jsonData.text && jsonData.text.startsWith('http')) {
        const imageUrl = jsonData.text
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
