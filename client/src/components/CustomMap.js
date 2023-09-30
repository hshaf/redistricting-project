import { MapContainer, TileLayer, useMap, Marker, Popup, GeoJSON } from 'react-leaflet';
import VADistricts from '../data/va-districts.json';
import AZDistricts from '../data/az-districts.json';
import WIDistricts from '../data/wi-districts.json';

function CustomMap() {
  return (
    <MapContainer center={[38.86438706880524, -95.47162384288428]} zoom={5} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON weight={1} color='blue' key={'Virginia'} data={VADistricts} />
        <GeoJSON weight={1} color='blue' key={'Arizona'} data={AZDistricts} />
        <GeoJSON weight={1} color='blue' key={'Wisconsin'} data={WIDistricts} />
    </MapContainer>
  );
}

export default CustomMap;
