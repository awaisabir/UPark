import React, { Component } from 'react';
import ReactMapboxGl, { Marker, Feature, Layer } from 'react-mapbox-gl';
const { ACCESS_TOKEN } = require('../config/config').default;

const Map = ReactMapboxGl({
  accessToken: ACCESS_TOKEN,
});

export default class Mapbox extends Component {
  render() {
    const { onMapClick } = this.props;
    return (
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: "500px",
          width: "100%"
        }}
        center={[-79.3832, 43.6532]}
        zoom={[11]}
      >
        <Marker
          coordinates={[-79.3766, 43.6621]}
          onClick={() => onMapClick(-79.3766, 43.6621)}
          anchor="bottom">
          <img alt="marker" height="30px" width="30px" src={"http://www.myiconfinder.com/uploads/iconsets/256-256-6096188ce806c80cf30dca727fe7c237.png"}/>
        </Marker>
      </Map>
    );
  }
}