import React, { Component } from 'react';
import ReactMapboxGl, { Marker } from 'react-mapbox-gl';
const { ACCESS_TOKEN } = require('../config/config').default;

const Map = ReactMapboxGl({
  accessToken: ACCESS_TOKEN,
});

export default class Mapbox extends Component {
  render() {
    const { onMapClick, coords, currentLocation, locations, lat, long } = this.props;
    return (
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: "500px",
          width: "100%"
        }}
        center={[long, lat]}
        zoom={[11]}
      >
        <Marker 
          coordinates={[long, lat]}
          onClick={() => onMapClick(long, lat)}
        >
          <img alt="your-location" height="30px" width="30px" src={"https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-256.png"}/>
        </Marker>

        {locations.map((_, i) => (
          <Marker
            key={i}
            coordinates={[_.Long, _.Lat]}
            onClick={() => onMapClick(_.Long, _.Lat)}
          >
            <img alt="hits" height="25px" width="25px" src={"http://www.myiconfinder.com/uploads/iconsets/256-256-6096188ce806c80cf30dca727fe7c237.png"}/>
          </Marker>
        ))}
      </Map>
    );
  }
}