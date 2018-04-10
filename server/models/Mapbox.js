const axios = require('axios');
const querystring = require('querystring');
const { ACCESS_TOKEN } = require('../config/mapbox');

class MapBox {
  constructor(ACCESS_TOKEN) {
    this._baseUrl = `https://api.mapbox.com/geocoding/v5/`;
    this.ACCESS_TOKEN = ACCESS_TOKEN;
    this.country = `ca`;
    this.limit = 1;
  }

  // private function to construct the url for the Mapbox functions
  _constructFullUrl(type, query) {
    switch (type) {
      case `GEO_FORWARD`:
        return `${this._baseUrl}mapbox.places/${query}.json?access_token=${this.ACCESS_TOKEN}&country=${this.country}&limit=${this.limit}`;
    
      default:
        break;
    }
    return 
  }

  // get co-ordinates from address
  async getForwardGeoLocation(address) {
    const url = this._constructFullUrl('GEO_FORWARD', querystring.stringify({query : address}));

    try {
      const { data } = await axios.default.get(url);      
      return data.features[0].center;
    } catch (err) { throw err; }
  }
}