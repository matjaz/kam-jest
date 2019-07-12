import PDFParser from 'pdf2json'

export default class PdfParser {
  parse (pdfBuffer) {
    return new Promise((resolve, reject) => {
      var pdfParser = new PDFParser()
      pdfParser.on('pdfParser_dataReady', (pdfData) => {
        resolve(pdfData.formImage)
      })

      pdfParser.on('pdfParser_dataError', (errData) => {
        reject(errData.parserError)
      })

      pdfParser.parseBuffer(pdfBuffer)
    })
  }

  getLines (parsedPdf) {
    var lines = []
    for (const page of parsedPdf.Pages) {
      for (const text of page.Texts) {
        lines.push(text.R.map((o) => decodeURIComponent(o.T)).join(' ').trim())
      }
    }
    return lines
  }
}
