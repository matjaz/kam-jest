import HttpJSONProvider from './http-json'

export default class MalcajtProvider extends HttpJSONProvider {

  constructor (regionID, cityID, id) {
    if (!id) {
      throw new Error('Missing id')
    }

    super({
      method: 'POST',
      uri: 'https://api.malcajt.com/getApiData.php',
      form: {
        action: 'lunch',
        region_id: regionID,
        city_id: cityID,
        near_me: false
      }
    })
    this.id = id
  }

  async fetch () {
    const resp = await super.fetch()
    if (resp && resp.Restaurants) {
      return resp.Restaurants.find(r => r.RestaurantID === this.id)
    }
  }

}
