import React, { Component } from "react";
import { Table, Container } from "react-bootstrap";

class DistanceMeasures extends Component {
  render () {
    if (!this.props.selectedState) {
      return (
        <div></div>
      );
    }

    var clusterData = Object.values(this.props.ensembleData[this.props.selectedState][this.props.selectedEnsembleID].clusters) // Change this to get data from request
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
}

export default DistanceMeasures;
