import { Button, Container, Table } from "react-bootstrap";
import { Component } from "react";
import VADistrictTest from "../data/va-district-test.json"

const clusterMaps = {
  "VA" : {
    "ensemble1" : {
      "clusterData" : {
        0 : VADistrictTest
      }
    }
  }
}

class ClusterAnalysis extends Component {
  render () {
    const clusterName = "Current map"

    const selectedDistrict = 0;
    const districtData = clusterMaps["VA"]["ensemble1"].clusterData[0].features[selectedDistrict].properties;

    return (
      <Container style={{ height: '80vh' }}>
        <div style={{minHeight: '30%' }}>
          <Table striped style={{}}>
            <thead>
              <tr>
                <th>{clusterName}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Polsby-Popper</td>
                <td>{0.5}</td>
              </tr>
              <tr>
                <td>Majority-Minority Districts</td>
                <td>{2}</td>
              </tr>
              <tr>
                <td>Partisan Lean</td>
                <td>{3}</td>
              </tr>
            </tbody>
          </Table>
          <Table striped style={{}}>
            <thead>
              <tr>
                <th>District #{districtData.DISTRICT}</th>
                <th>Pop</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total</td>
                <td>{districtData.pop_total}</td>
                <td>100.0</td>
              </tr>
              <tr>
                <td>White</td>
                <td>Info2</td>
                <td>{(100 * districtData.pct_white).toFixed(1)}</td>
              </tr>
              <tr>
                <td>Black</td>
                <td>Info2</td>
                <td>{(100 * districtData.pct_black).toFixed(1)}</td>
              </tr>
              <tr>
                <td>Native</td>
                <td>Info2</td>
                <td>{(100 * districtData.pct_native).toFixed(1)}</td>
              </tr>
              <tr>
                <td>Asian</td>
                <td>Info2</td>
                <td>{(100 * districtData.pct_asian).toFixed(1)}</td>
              </tr>
              <tr>
                <td>Pacific</td>
                <td>Info2</td>
                <td>{(100 * districtData.pct_pacific).toFixed(1)}</td>
              </tr>
              <tr>
                <td>Two or more races</td>
                <td>Info2</td>
                <td>{(100 * districtData.pct_two_or_more).toFixed(1)}</td>
              </tr>
              <tr>
                <td>Hispanic</td>
                <td>Info2</td>
                <td>{(100 * districtData.pct_hispanic).toFixed(1)}</td>
              </tr>
            </tbody>
          </Table>
          <Table striped style={{}}>
            <thead>
              <tr>
                <th></th>
                <th>Votes</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total</td>
                <td>Info2</td>
                <td>100.0</td>
              </tr>
              <tr>
                <td>Democrat</td>
                <td>Info2</td>
                <td>{(100 * districtData.pct_vote_dem).toFixed(1)}</td>
              </tr>
              <tr>
                <td>Republican</td>
                <td>Info2</td>
                <td>{(100 * districtData.pct_vote_rep).toFixed(1)}</td>
              </tr>
              <tr>
                <td>Other</td>
                <td>Info2</td>
                <td>{(100 * districtData.pct_vote_other).toFixed(1)}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Container>
    );
  }
}

export default ClusterAnalysis;
