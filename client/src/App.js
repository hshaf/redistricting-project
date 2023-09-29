import logo from './logo.svg';
import './App.css';
import { Col, Row } from 'react-bootstrap';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import VisualComponent from "./components/VisualComponent";

function App() {
  return (
    <div className="App">

<Row>
      <Col xs={4}><VisualComponent /></Col>
      <Col>
        <MapContainer center={[40.912758739378624, -73.12381229926775]} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[40.912758739378624, -73.12381229926775]}>
          <Popup>
            CSE 416
            
          </Popup>
        </Marker>
      </MapContainer>
      </Col>
      </Row>
    </div>
  );
}

export default App;
