import logo from './logo.svg';
import './App.css';

import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
