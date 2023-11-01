import React from "react";
import { Table, Container } from "react-bootstrap";

export default function DistanceMeasures(props) {
  // Render nothing if no state is selected
  // Component should not be accessible in this state
  if (!props.selectedState) {
    return (
      <div></div>
    );
  }

  // Generate distance measures table
  var clusterData = Object.values(props.ensembleData[props.selectedState][props.selectedEnsembleID].clusters) // Change this to get data from request
  const distanceTableEntries = clusterData.map((cluster) => {
    const clusterNum = cluster["clusterNum"]
    const clusterSize = cluster["count"]
    const optimalTransport = cluster["distances"]["optimalTransport"];
    const hamming = cluster["distances"]["hamming"];
    const totalVariation = cluster["distances"]["totalVariation"];
    return (
      <tr key={`row-${clusterNum}`}>
        <td>{clusterNum}</td>
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