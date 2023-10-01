import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import React, { Component } from "react";
import VAStateBoundaries from '../data/va-state-boundary.json';
import AZStateBoundaries from '../data/az-state-boundary.json';
import WIStateBoundaries from '../data/wi-state-boundary.json';
import VADistricts from '../data/va-districts.json';
import AZDistricts from '../data/az-districts.json';
import WIDistricts from '../data/wi-districts.json';
import ChangeView from './ChangeView';

class CustomMap extends Component {
  constructor () {
    super();
    // Center of map coordinates
    this.mapCenter = [38.86438706880524, -95.47162384288428];
    // Current zoom level
    this.mapZoom = 7;
    /* Boundary data for states. Can currently either show state 
    or district (federal, senate, or house) boundaries. By default
    we show the state boundaries. */
    this.vaBoundariesData = VAStateBoundaries;
    this.azBoundariesData = AZStateBoundaries;
    this.wiBoundariesData = WIStateBoundaries;
    /* To change the overlay on an existing GeoJSON object, we can
    change the key value to force the object to rerender */
    this.keyCount = 0;
  }

  render () {
    if (this.props.selectedState == "VA") {
      // Update map center over Virginia
      this.mapCenter = [37.47812615585515, -78.88801623378961];
      // Update zoom level
      this.mapZoom = 7;
      // Update boundary data for states
      this.vaBoundariesData = VADistricts;
      this.azBoundariesData = AZStateBoundaries;
      this.wiBoundariesData = WIStateBoundaries;
    }

    else if (this.props.selectedState == "AZ") {
      // Update map center over Arizona
      this.mapCenter = [34.35920229576733, -111.82765189051278];
      // Update zoom level
      this.mapZoom = 7;
      // Update boundary data for states
      this.vaBoundariesData = VAStateBoundaries;
      this.azBoundariesData = AZDistricts;
      this.wiBoundariesData = WIStateBoundaries;
    }

    else if (this.props.selectedState == "WI") {
      // Update map center over Wisconsin
      this.mapCenter = [44.61389658316453, -89.67045816895208];
      // Update zoom level
      this.mapZoom = 7;
      // Update boundary data for states
      this.vaBoundariesData = VAStateBoundaries;
      this.azBoundariesData = AZStateBoundaries;
      this.wiBoundariesData = WIDistricts;
    }

    else {
      // Reset map center
      this.mapCenter = [38.86438706880524, -95.47162384288428];
      // Update zoom level
      this.mapZoom = 5;
      // Update boundary data for states
      this.vaBoundariesData = VAStateBoundaries;
      this.azBoundariesData = AZStateBoundaries;
      this.wiBoundariesData = WIStateBoundaries;
    }

    this.keyCount += 1;
    
    return (
      <MapContainer center={this.mapCenter} zoom={this.mapZoom} scrollWheelZoom={true}>
        <ChangeView center={this.mapCenter} zoom={this.mapZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON 
        weight={1} 
        color='blue' 
        key={'Virginia' + this.keyCount} 
        data={this.vaBoundariesData} 
        eventHandlers={{
          click: () => {
            this.props.updateSelectedState("VA");
          }
        }} 
        />
        <GeoJSON 
        weight={1} 
        color='blue' 
        key={'Arizona' + this.keyCount} 
        data={this.azBoundariesData}
        eventHandlers={{
          click: () => {
            this.props.updateSelectedState("AZ");
          }
        }}
        />
        <GeoJSON 
        weight={1} 
        color='blue' 
        key={'Wisconsin' + this.keyCount} 
        data={this.wiBoundariesData} 
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
