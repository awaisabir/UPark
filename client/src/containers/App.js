import React, { Component } from 'react';
import { Container, Header, Button, Loader, Modal } from 'semantic-ui-react';
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
      open : false,
      err : {},
    };

    this.onMapClick    = this.onMapClick.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.show          = this.show.bind(this);
    this.close         = this.close.bind(this);
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
    this.setState({location}, () => {
      this.show('mini');
    });
  }

  onButtonClick() {
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

  show (size) {
    this.setState({ size, open: true });
  }

  close() {
    this.setState({open: false});
  }

  render() {
    const { 
      lat, 
      long, 
      coords, 
      locations, 
      location, 
      fetching, 
      open, 
      size } = this.state;

    return (
      <Container className="App">
      <Header className="title" as='h1'>COMP 4601 Final Term Project</Header>
      <p><strong>Latitude: </strong>{lat}, <strong>Longitude: </strong>{long}</p>
      <div className="map">
        {fetching ? <Loader style={{marginBottom: '10px'}} active inline='centered' /> : null}
          <Mapbox
            onMapClick={this.onMapClick}
            onMarkerClick={this.onMarkerClick}
            locations={locations}
            coords={coords}
            lat={lat}
            long={long}
          />
          <Button style={{marginTop: '20px'}} 
            onClick={() => this.onButtonClick()}
          >
            Get Best Locations
          </Button>
        </div>

        {/** Modal Setup **/}
        <Modal size={size} open={open} onClose={this.close}>
          <Modal.Header>
            {location !== '' ? location.Address : "N/A"}
          </Modal.Header>
          <Modal.Content>
            <p><strong>Average Price: </strong>{location.Price}</p>
            <p><strong># of Tickets: </strong>{location.Tickets}</p>
          </Modal.Content>
        </Modal>
      </Container>
    );
  }
}

export default App;
