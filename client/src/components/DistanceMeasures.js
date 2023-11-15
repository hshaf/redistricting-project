import React, { useContext } from "react";
import { Table, Container } from "react-bootstrap";
import { AppStateContext } from "../context/AppStateContext";
import { AppDataContext } from "../context/AppDataContext";

export default function DistanceMeasures(props) {
  const appState = useContext(AppStateContext);
  const appData = useContext(AppDataContext);

  let selectedEnsemble = null;
  let clusters = null;

  if (appState.selectedEnsembleID && appData.selectedStateEnsembles) {
    selectedEnsemble = appData.selectedStateEnsembles[appState.selectedEnsembleID];
  }

  if (appData.selectedEnsembleClusters) {
    clusters = appData.selectedEnsembleClusters;
  }

  // Render nothing if no state is selected
  // Component should not be accessible in this state
  if (!appState.selectedState) {
    return (
      <div></div>
    );
  }

  // Generate distance measures table
  var clusterData = [];

  if (clusters) {
    clusterData = clusters;
  }

  const distanceTableEntries = clusterData.map((cluster, idx) => {
    const clusterSize = cluster["districtCount"]
    const optimalTransport = cluster["distances"]["optimalTransport"];
    const hamming = cluster["distances"]["hamming"];
    const totalVariation = cluster["distances"]["totalVariation"];
    return (
      <tr key={`row-${idx}`}>
        <td>{(idx + 1)}</td>
        <td>{clusterSize}</td>
        <td>{optimalTransport.toFixed(3)}</td>
        <td>{hamming.toFixed(3)}</td>
        <td>{totalVariation.toFixed(3)}</td>
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
        Cluster Distance Measures
      </h4>
      <div style={{ overflowY: 'auto', minHeight: '30%' }}>
        <Table striped style={{}}>
          <thead>
            <tr>
              <th>Cluster ID</th>
              <th>Cluster Size</th>
              <th>Optimal Transport</th>
              <th>Hamming Distance</th>
              <th>Total Variation Distance</th>
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