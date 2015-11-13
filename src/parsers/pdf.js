import PDFParser from 'pdf2json';

export default class PdfParser {

  parse(pdfBuffer) {
    return new Promise((resolve, reject) => {
      var pdfParser = new PDFParser();
      pdfParser.on('pdfParser_dataReady', (e) => {
        resolve(e.data);
        e.destroy();
      });

      pdfParser.on('pdfParser_dataError', (e) => {
        reject(e.data);
        e.destroy();
      });

      pdfParser.parseBuffer(pdfBuffer);
    });
  }

  getLines(parsedPdf) {
    var lines = [];
    for (let page of parsedPdf.Pages) {
      for (let text of page.Texts) {
        lines.push(text.R.map(o => decodeURIComponent(o.T)).join(' ').trim());
      }
    }
    return lines;
  }
}
