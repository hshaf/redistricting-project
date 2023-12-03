import React, { useContext } from "react";
import { Table, Container } from "react-bootstrap";
import { AppStateContext } from "../context/AppStateContext";
import { AppDataContext } from "../context/AppDataContext";

export default function DistanceMeasures(props) {
  // Context
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

  // Render nothing if no state or ensemble is selected
  if (!appState.selectedState || appState.selectedEnsembleID === "" || !selectedEnsemble || !clusters) {
    return (
      <div></div>
    );
  }

  const distanceTableEntries = clusters.map((cluster, idx) => {
    let clusterSize = cluster["districtCount"]
    let optimalTransport = cluster["distances"]["optimalTransport"];
    let hamming = cluster["distances"]["hamming"];
    let totalVariation = cluster["distances"]["totalVariation"];
    if (optimalTransport) {
      optimalTransport = optimalTransport.toFixed(3)
    }
    else {
      optimalTransport = "&mdash;"
    }
    
    if (hamming) {
      hamming = hamming.toFixed(3)
    }
    else {
      hamming = "&mdash;"
    }
    if (totalVariation) {
      totalVariation = totalVariation.toFixed(3)
    }
    else {
      totalVariation = "&mdash;"
    }

    return (
      <tr key={`row-${idx}`}>
        <td>{(idx + 1)}</td>
        <td>{clusterSize}</td>
        <td>{optimalTransport}</td>
        <td>{hamming}</td>
        <td>{totalVariation}</td>
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