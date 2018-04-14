import React, { Component } from 'react';
import { Container, Header } from 'semantic-ui-react';
import '../styles/App.css';

import Mapbox from '../components/Mapbox';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat : 43.6532,
      long : -79.3832,
      success : false,
      coords : [],
      fetched : false,
      err : {},
    };

    this.updateCoords = this.updateCoords.bind(this);
  }

  componentDidMount() {
    const { lat, long } = this.state;
    (async () => {
      try {
        let raw = await fetch(`http://localhost:3000/best/${lat}/${long}`);
        let response = await raw.json();
  
        const { value, success } = response;
  
        this.setState({fetched: true, coords: value, success, err: {}});
      } catch (err) {
        this.setState({fetched: true, coords: [], success: false, err});
      }
    })();
  }

  updateCoords(long, lat) {
    this.setState({lat, long});
  }

  render() {
    const { lat, long, coords } = this.state;

    return (
      <Container className="App">
        <Header className="title" as='h1'>COMP 4601 Final Term Project</Header>
        <p><strong>Latitude: </strong>{lat}, <strong>Longitude: </strong>{long}</p>
        <div className="map">
          <Mapbox 
            onMapClick={this.updateCoords}
            coords={coords}
            currentLocation={{lat, long}}
          />
        </div>
      </Container>
    );
  }
}

export default App;
