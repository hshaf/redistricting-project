import React, { useContext } from "react";
import { Table, Container } from "react-bootstrap";
import { AppStateContext } from "../context/AppStateContext";
import { AppDataContext } from "../context/AppDataContext";

const distanceMeasureKeys = {
  "optimalTransport": "Optimal Transport",
  "hamming": "Hamming",
  "entropy": "Entropy"
}

export default function DistanceMeasures(props) {
  // Context
  const appState = useContext(AppStateContext);
  const appData = useContext(AppDataContext);

  // Render nothing if no state or ensemble is selected
  if (appState.selectedState === null || appState.selectedEnsembleID === null || !appData.selectedStateEnsembles) {
    return (
      <div></div>
    );
  }

  // Get data for ensemble from global app data
  let selectedEnsemble = appData.selectedStateEnsembles[appState.selectedEnsembleID];

  const distanceTableEntries = Object.keys(distanceMeasureKeys).map((dm, idx) => {
    // let clusterSize = cluster["districtCount"]
    const distance = selectedEnsemble["avgDistances"][dm]
    return (
      <tr key={`row-${idx}`}>
        <td>{distanceMeasureKeys[dm]}</td>
        <td>{distance ? distance.toFixed(3) : "N/A"}</td>
      </tr>
    )}
  );

  // Render DistanceMeasures
  return (
    <Container style={{ height: '80vh' }}>
      <h4>
        List of Distance Measure Functions
      </h4>
      <Container>
        <ul>
          <li>Optimal Transport</li>
          <li>Hamming Distance</li>
          <li>Total Variation Distance</li>
          <li>Centroid-Based Clustering</li>
        </ul>
      </Container>
      <h4>
        {selectedEnsemble["name"] + " Distance Measures"}
      </h4>
      <div style={{ overflowY: 'auto', minHeight: '30%' }}>
        <Table striped style={{}}>
          <thead>
            <tr>
              <th>Distance Measure</th>
              <th>Avg. Pair Distance</th>
            </tr>
          </thead>
          <tbody>
            {distanceTableEntries}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}