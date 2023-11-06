import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useState, useRef } from "react";
import VAStateBoundaries from '../data/va-state-boundary.json';
import AZStateBoundaries from '../data/az-state-boundary.json';
import WIStateBoundaries from '../data/wi-state-boundary.json';
import VADistricts from '../data/va-districts.json';
import AZDistricts from '../data/az-districts.json';
import WIDistricts from '../data/wi-districts.json';
import ChangeView from './ChangeView';

export default function CustomMap(props) {
  // Center of map coordinates
  let mapCenter = [38.86438706880524, -95.47162384288428];
  // Current zoom level
  let mapZoom = 7;
  /* Boundary data for states. Can currently either show state 
  or district (federal, senate, or house) boundaries. By default
  we show the state boundaries. */
  let vaBoundariesData = VAStateBoundaries;
  let azBoundariesData = AZStateBoundaries;
  let wiBoundariesData = WIStateBoundaries;
  /* To change the overlay on an existing GeoJSON object, we can
  change the key value to force the object to re-render.
  It is saved with useRef so it is persistent. */
  let keyCount = useRef(0);
  keyCount.current = keyCount.current + 1;

  if (props.selectedState === "VA") {
    // Update map center over Virginia
    mapCenter = [37.47812615585515, -78.88801623378961];
    // Update zoom level
    mapZoom = 7;
    // Update boundary data for states
    vaBoundariesData = VADistricts;
    azBoundariesData = AZStateBoundaries;
    wiBoundariesData = WIStateBoundaries;
  }

  else if (props.selectedState === "AZ") {
    // Update map center over Arizona
    mapCenter = [34.35920229576733, -111.82765189051278];
    // Update zoom level
    mapZoom = 7;
    // Update boundary data for states
    vaBoundariesData = VAStateBoundaries;
    azBoundariesData = AZDistricts;
    wiBoundariesData = WIStateBoundaries;
  }

  else if (props.selectedState === "WI") {
    // Update map center over Wisconsin
    mapCenter = [44.61389658316453, -89.67045816895208];
    // Update zoom level
    mapZoom = 7;
    // Update boundary data for states
    vaBoundariesData = VAStateBoundaries;
    azBoundariesData = AZStateBoundaries;
    wiBoundariesData = WIDistricts;
  }

  else {
    // Reset map center
    mapCenter = [38.86438706880524, -95.47162384288428];
    // Update zoom level
    mapZoom = 5;
    // Update boundary data for states
    vaBoundariesData = VAStateBoundaries;
    azBoundariesData = AZStateBoundaries;
    wiBoundariesData = WIStateBoundaries;
  }

  // Render CustomMap
  return (
    <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true}>
      <ChangeView center={mapCenter} zoom={mapZoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON 
        weight={1} 
        color='blue' 
        key={'Virginia' + keyCount.current} 
        data={vaBoundariesData} 
        eventHandlers={{
          click: () => {
            props.updateSelectedState("VA");
          }
        }} 
      />
      <GeoJSON 
        weight={1} 
        color='blue' 
        key={'Arizona' + keyCount.current} 
        data={azBoundariesData}
        eventHandlers={{
          click: () => {
            props.updateSelectedState("AZ");
          }
        }}
      />
      <GeoJSON 
        weight={1} 
        color='blue' 
        key={'Wisconsin' + keyCount.current} 
        data={wiBoundariesData} 
        eventHandlers={{
          click: () => {
            props.updateSelectedState("WI");
          }
        }}  
      />
    </MapContainer>
  );
}
