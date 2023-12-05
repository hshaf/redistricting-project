import { useContext, useEffect, useRef, useState } from "react";
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import { AppStateActionType, AppStateContext, AppStateDispatch } from '../context/AppStateContext';
import { AppDataContext, AppDataDispatch } from "../context/AppDataContext";
import AZDistricts from '../data/az-districts.json';
import AZStateBoundaries from '../data/az-state-boundary.json';
import VADistricts from '../data/va-districts.json';
import VAStateBoundaries from '../data/va-state-boundary.json';
import WIDistricts from '../data/wi-districts.json';
import WIStateBoundaries from '../data/wi-state-boundary.json';
import ChangeView from './ChangeView';
import serverAPI from '../serverAPI'

const defaultMapCenter = [38.86438706880524, -95.47162384288428];
const defaultMapZoom = 7;

export default function CustomMap(props) {
  // Context
  const appState = useContext(AppStateContext);
  const appStateDispatch = useContext(AppStateDispatch);
  const appData = useContext(AppDataContext);
  const dataAPI = useContext(AppDataDispatch);

  const [boundary, setBoundary] = useState(null);

  /* To change the overlay on an existing GeoJSON object, we can
  change the key value to force the object to re-render.
  It is saved with useRef so it is persistent. */
  let keyCount = useRef(0);
  keyCount.current = keyCount.current + 1;

  // Center of map coordinates
  let mapCenter = appState.selectedState ? appData.stateData.get(appState.selectedState)["mapCenter"] : defaultMapCenter;
  let mapZoom = appState.selectedState ? appData.stateData.get(appState.selectedState)["mapZoom"] : defaultMapZoom;

  let stateGeoJSONs = [...appData.stateData.values()].map((stateEntry) => {
    console.log(stateEntry);
    const stateInitials = stateEntry["initials"];

    // Set map zoom and center
    mapCenter = stateEntry["mapCenter"];
    mapZoom = stateEntry["mapZoom"];

    // Retrieve state boundary and current district plan map
    let stateBoundaries = appData.stateBoundaries.get(stateInitials);
    if (appData.selectedState === stateInitials) {
      if (boundary === null) {
        stateBoundaries = appData.currDistrictPlans.get(stateInitials);
      }
      else {
        stateBoundaries = boundary;
      }
    }

    return (
      <GeoJSON 
        weight={1} 
        color='blue' 
        key={stateInitials + keyCount.current} 
        data={JSON.parse(stateBoundaries)} 
        eventHandlers={{
          click: () => {
            appStateDispatch({
              type: AppStateActionType.SET_SELECTED_STATE,
              payload: stateInitials
            })
            dataAPI.getEnsemblesForState(stateInitials);
          }
        }} 
      />
    );
  })
  /*
  for (let stateEntry in appData.stateData.entries()) {
    console.log(stateEntry);
    const stateInitials = stateEntry.key;
    const stateData = stateEntry.value;

    // Set map zoom and center
    mapCenter = stateData["mapCenter"];
    mapZoom = stateData["mapZoom"];

    // Retrieve state boundary and current district plan map
    let stateBoundaries = appData.stateBoundaries.get(stateInitials);
    if (appData.selectedState === stateInitials) {
      stateBoundaries = appData.currDistrictPlans.get(stateInitials);
    }
    if (boundary !== null) {
      stateBoundaries = boundary;
    }

    stateGeoJSONs.push(
      <GeoJSON 
        weight={1} 
        color='blue' 
        key={stateInitials + keyCount.current} 
        data={JSON.parse(stateBoundaries)} 
        eventHandlers={{
          click: () => {
            appStateDispatch({
              type: AppStateActionType.SET_SELECTED_STATE,
              payload: stateInitials
            })
            dataAPI.getEnsemblesForState(stateInitials);
          }
        }} 
      />
    );
  }
  */
  console.log(stateGeoJSONs);

  // Retrieve boundary when selected cluster changes
  let getBoundary = async (boundaryID) => {
    console.log("Retrieve boundary " + boundaryID);
    const response = await serverAPI.getBoundaryById(boundaryID);
    if (response.status === 200) {
      setBoundary(response.data.data);
    }
  }
  useEffect(() => {
    if (appState.selectedClusterID) {
      getBoundary(appData.selectedEnsembleClusters[appState.selectedClusterID]["boundary"]);
    }
    else {
      setBoundary(null);
    }
  }, [appData.selectedEnsembleClusters, appState.selectedClusterID]);

  // Render CustomMap
  return (
    <MapContainer center={mapCenter} zoom={mapZoom} scrollWheelZoom={true}>
      <ChangeView center={mapCenter} zoom={mapZoom} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stateGeoJSONs}
    </MapContainer>
  );
}
