import { useContext, useEffect, useRef, useState } from "react";
import { GeoJSON, MapContainer, TileLayer } from 'react-leaflet';
import { AppStateActionType, AppStateContext, AppStateDispatch } from '../context/AppStateContext';
import { AppDataContext, AppDataDispatch } from "../context/AppDataContext";
import ChangeView from './ChangeView';
import serverAPI from '../serverAPI'

const defaultMapCenter = [38.86438706880524, -95.47162384288428];
const defaultMapZoom = 5;

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
    const stateInitials = stateEntry["initials"];

    // Retrieve state boundary and current district plan map
    let stateBoundaries = appData.stateBoundaries.get(stateInitials);
    if (appState.selectedState === stateInitials) {
      if (appState.displayedBoundary === null) {
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

  // Retrieve boundary
  let getBoundary = async (boundaryID) => {
    const response = await serverAPI.getBoundaryById(boundaryID);
    if (response.status === 200) {
      setBoundary(response.data.data);
    }
  }
  useEffect(() => {
    if (appState.displayedBoundary !== null) {
      getBoundary(appState.displayedBoundary);
    }
    else {
      setBoundary(null);
    }
  }, [appState.displayedBoundary]);

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
