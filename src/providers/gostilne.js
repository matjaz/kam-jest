import HttpJSONProvider from './http-json'

export default class GostilneProvider extends HttpJSONProvider {
  constructor (id) {
    if (!id) {
      throw new Error('Missing id')
    }
    var baseUrl = `http://www.gostilne.si/jsonGostilne.php?pos=46%2C15&hash=${id}&action2=hash`
    super(baseUrl)
    this.dataUrl = `${baseUrl}Data`
  }

  async fetchData () {
    var lat
    var lon
    var name = (await this.fetch()).name
    var additionalData = await this.fetchUrl(this.dataUrl)
    if (additionalData && typeof additionalData.latlng === 'string') {
      let parts = additionalData.latlng.split(/,\s*/).map(parseFloat)
      if (parts.length === 2) {
        lat = parts[0]
        lon = parts[1]
      }
    }
    return {
      name,
      location: {
        lat,
        lon
      }
    }
  }
}
