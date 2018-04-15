const axios = require('axios');
const querystring = require('querystring');
const { ACCESS_TOKEN } = require('../config/mapbox');

/**
 * @class : Mapbox
 */
class MapBox {

  /**
   * @constructor : Initalizes url structure for calls to the Mapbox API
   */
  constructor() {
    this._baseUrl = `https://api.mapbox.com/geocoding/v5/`;
    this.ACCESS_TOKEN = ACCESS_TOKEN;
    this.city = `%2C%20toronto`;
    this.country = `ca`;
    this.limit = 1;
  }

  // private function to construct the url for the Mapbox functions
  _constructFullUrl(type, query) {
    switch (type) {
      case `GEO_FORWARD`:
        return `${this._baseUrl}mapbox.places/${query}${this.city}.json?access_token=${this.ACCESS_TOKEN}&country=${this.country}&limit=${this.limit}`;
    
      default:
        break;
    }
    return 
  }

  // get co-ordinates from address
  getForwardGeoLocation(address) {
    const url = this._constructFullUrl('GEO_FORWARD', querystring.stringify({query : address}));

    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.default.get(url);
        if (data.features.length !== 0)
          resolve({...data.features[0].center});
        
        reject(`Location does not exist`);
      } catch (err) { reject(err); }
    });
  }
}

module.exports = MapBox;