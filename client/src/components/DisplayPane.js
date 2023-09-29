import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import VisualComponent from "./VisualComponent";

function DisplayPane () {
  return (
    <div id="display-pane">
      <div id="visual-pane">
      <VisualComponent></VisualComponent>
      </div>
      
      <div id="map">
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
    </div>
  );
}

export default DisplayPane;
