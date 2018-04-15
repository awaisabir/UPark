import React, { Component } from 'react';
import { Container, Header, Button, Dimmer, Loader, Image, Segment } from 'semantic-ui-react';
import '../styles/App.css';

import Mapbox from '../components/Mapbox';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat : 43.6532,
      long : -79.3832,
      success : false,
      locations: [],
      location: {},
      coords : [],
      fetched : false,
      fetching : true,
      err : {},
    };

    this.onMapClick    = this.onMapClick.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  componentDidMount() {
    const { lat, long } = this.state;
    this.setState({fetching: true}, async () => {
      try {
        let raw = await fetch(`http://localhost:3000/locations?lat=${lat}&long=${long}`);
        let response = await raw.json();
        
        const { value, success } = response;
        this.setState({fetched: true, fetching: false, locations: value, success, err: {}});
      } catch (err) {
        this.setState({fetched: true, fetching: false, success: false, err});
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { lat, long } = prevState;
    
    if (this.state.lat !== lat || this.state.long !== long) {
      this.setState({fetching : true}, async () => {
        try {
          let raw = await fetch(`http://localhost:3000/locations?lat=${this.state.lat}&long=${this.state.long}`);
          let response = await raw.json();

          const { value, success } = response;
            
          this.setState({fetched: true, fetching: false, locations: value, success, err: {}});
        } catch (err) {
          this.setState({fetched: true, fetching: false, success: false, err});
        }
      });
    }   
  }

  onMapClick(map, e) {
    const { lat, lng } = e.lngLat;
    this.setState({lat, long: lng});
  }

  onMarkerClick(location) {
    this.setState({location});
  }

  async onButtonClick() {
    this.setState({fetching : true}, async () => {
      try {
        let raw = await fetch(`http://localhost:3000/best/${this.state.lat}/${this.state.long}`);
        let response = await raw.json();
        
        const { value, success } = response;

        this.setState({fetched: true, fetching: false, locations: value, success, err: {}});
      } catch (err) {
        this.setState({fetched: true, fetching: false, success: false, err});
      }
    });
  }

  render() {
    const { lat, long, coords, locations, location, fetching } = this.state;
    return (
      <Container className="App">
        {fetching ? 'Loading?...' : null}
        <Header className="title" as='h1'>COMP 4601 Final Term Project</Header>
        <p><strong>Latitude: </strong>{lat}, <strong>Longitude: </strong>{long}</p>
        <div className="map">
          <Mapbox
            onMapClick={this.onMapClick}
            onMarkerClick={this.onMarkerClick}
            locations={locations}
            coords={coords}
            lat={lat}
            long={long}
          />
        <Button 
          style={{marginTop: '20px'}} 
          text='Best Locations'
          onClick={() => this.onButtonClick()}
        >
          Get Best Locations</Button>
        </div>
      </Container>
    );
  }
}

export default App;
