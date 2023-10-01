import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import React, { Component } from "react";
import VAStateBoundaries from '../data/va-state-boundary.json';
import AZStateBoundaries from '../data/az-state-boundary.json';
import WIStateBoundaries from '../data/wi-state-boundary.json';
// import VADistricts from '../data/va-districts.json';
// import AZDistricts from '../data/az-districts.json';
// import WIDistricts from '../data/wi-districts.json';

class CustomMap extends Component {
  render () {
    return (
      <MapContainer center={[38.86438706880524, -95.47162384288428]} zoom={5} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON 
        weight={1} 
        color='blue' 
        key={'Virginia'} 
        data={VAStateBoundaries} 
        eventHandlers={{
          click: () => {
            this.props.updateSelectedState("VA");
          }
        }} 
        />
        <GeoJSON 
        weight={1} 
        color='blue' 
        key={'Arizona'} 
        data={AZStateBoundaries}
        eventHandlers={{
          click: () => {
            this.props.updateSelectedState("AZ");
          }
        }}
        />
        <GeoJSON 
        weight={1} 
        color='blue' 
        key={'Wisconsin'} 
        data={WIStateBoundaries} 
        eventHandlers={{
          click: () => {
            this.props.updateSelectedState("WI");
          }
        }}  
        />
      </MapContainer>
    );
  }
}

export default CustomMap;
