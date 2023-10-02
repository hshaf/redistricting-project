import { Button, Container, Nav, NavDropdown, Navbar, Table } from "react-bootstrap";
import { Component } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts';
import VADistrictTest from "../data/va-district-test.json"

const districtDotColor = "#8d84d8";

const data01 = {
  "AZ" : {
    1: {cluster: 1, count: 100, polsbyPopper: 0.5, majMin: 0, partisanLean: -2},
    2: {cluster: 2, count: 80, polsbyPopper: 0.1, majMin: 5, partisanLean: 4},
    3: {cluster: 3, count: 160, polsbyPopper: 0.9, majMin: 2, partisanLean: 5},
    4: {cluster: 4, count: 50, polsbyPopper: 0.7, majMin: 1, partisanLean: -5},
    5: {cluster: 5, count: 30, polsbyPopper: 0.4, majMin: 3, partisanLean: 4}
  },
  "VA" : {
    1: {cluster: 1, count: 200, polsbyPopper: 0.5, majMin: 3, partisanLean: 2},
    2: {cluster: 2, count: 20, polsbyPopper: 0.3, majMin: 6, partisanLean: -4},
    3: {cluster: 3, count: 50, polsbyPopper: 0.2, majMin: 3, partisanLean: 2},
    4: {cluster: 4, count: 150, polsbyPopper: 0.4, majMin: 8, partisanLean: -1},
    5: {cluster: 5, count: 70, polsbyPopper: 0.6, majMin: 1, partisanLean: 6}
  },
  "WI" : {
    1: {cluster: 1, count: 70, polsbyPopper: 0.3, majMin: 0, partisanLean: -3},
    2: {cluster: 2, count: 150, polsbyPopper: 0.7, majMin: 5, partisanLean: -4},
    3: {cluster: 3, count: 60, polsbyPopper: 0.8, majMin: 2, partisanLean: -6},
    4: {cluster: 4, count: 40, polsbyPopper: 0.3, majMin: 1, partisanLean: 5},
    5: {cluster: 5, count: 120, polsbyPopper: 0.5, majMin: 3, partisanLean: 4}
  }
}

const dummyClusters = {
  1: {
    districts: [
      {district: 1, polsbyPopper: 0.55, majMin: 0, partisanLean: -2},
      {district: 2, polsbyPopper: 0.51, majMin: 5, partisanLean: 4},
      {district: 3, polsbyPopper: 0.59, majMin: 2, partisanLean: 5},
      {district: 4, polsbyPopper: 0.57, majMin: 1, partisanLean: -5},
      {district: 5, polsbyPopper: 0.54, majMin: 3, partisanLean: 4}
    ]
  },
  2: {
    districts: [
      {cluster: 1, polsbyPopper: 0.35, majMin: 3, partisanLean: 2},
      {cluster: 2, polsbyPopper: 0.33, majMin: 6, partisanLean: -4},
      {cluster: 3, polsbyPopper: 0.32, majMin: 3, partisanLean: 2},
      {cluster: 4, polsbyPopper: 0.34, majMin: 8, partisanLean: -1},
      {cluster: 5, polsbyPopper: 0.36, majMin: 1, partisanLean: 6}
    ]
  },
  3: {
    districts: [
      {cluster: 1, polsbyPopper: 0.43, majMin: 0, partisanLean: -3},
      {cluster: 2, polsbyPopper: 0.47, majMin: 5, partisanLean: -4},
      {cluster: 3, polsbyPopper: 0.48, majMin: 2, partisanLean: -6},
      {cluster: 4, polsbyPopper: 0.43, majMin: 1, partisanLean: 5},
      {cluster: 5, polsbyPopper: 0.45, majMin: 3, partisanLean: 4}
    ]
  },
  4: {
    districts: [
      {district: 1, polsbyPopper: 0.25, majMin: 0, partisanLean: -2},
      {district: 2, polsbyPopper: 0.21, majMin: 5, partisanLean: 4},
      {district: 3, polsbyPopper: 0.29, majMin: 2, partisanLean: 5},
      {district: 4, polsbyPopper: 0.27, majMin: 1, partisanLean: -5},
      {district: 5, polsbyPopper: 0.24, majMin: 3, partisanLean: 4}
    ]
  },
  5: {
    districts: [
      {district: 1, polsbyPopper: 0.65, majMin: 3, partisanLean: 2},
      {district: 2, polsbyPopper: 0.63, majMin: 6, partisanLean: -4},
      {district: 3, polsbyPopper: 0.62, majMin: 3, partisanLean: 2},
      {district: 4, polsbyPopper: 0.64, majMin: 8, partisanLean: -1},
      {district: 5, polsbyPopper: 0.66, majMin: 1, partisanLean: 6}
    ]
  }
};

const clusterMaps = {
  "AZ" : {
    "ensemble1" : {
      "clusterData" : dummyClusters
    }
  },
  "VA" : {
    "ensemble1" : {
      "clusterData" : dummyClusters
    }
  },
  "WI" : {
    "ensemble1" : {
      "clusterData" : dummyClusters
    }
  }
}

class ClusterAnalysis extends Component {
  constructor(props) {
      super(props);
      this.state = {
          xAxisVar: "polsbyPopper",
          yAxisVar: "majMin",
      }
  }
  axisLabels = {
    "polsbyPopper": "Polsby-Popper",
    "majMin": "Majority-Minority Districts",
    "partisanLean": "Partisan Lean"
  }
  setXAxisVar = (axisOption) => {
    this.setState(prevState => {
      return {
        xAxisVar: axisOption,
        yAxisVar: prevState.yAxisVar
      };
    })
  }
  setYAxisVar = (axisOption) => {
    this.setState(prevState => {
      return {
        xAxisVar: prevState.xAxisVar,
        yAxisVar: axisOption
      };
    })
  }
  setSelectedPlan = (planNum) => {
    console.log("Select plan " + planNum);
  }
  renderScatterplotDot = (input) => {
    const cx = input.cx;
    const cy = input.cy;
    return (
      <Dot
        cx={cx} cy={cy}
        r={4}
        stroke="black"
        strokeWidth={1}
        fill={districtDotColor}
        onClick={() => this.setSelectedPlan(input.payload["district"])}
        />
    );
  }
  render () {
    if (!this.props.selectedState || this.props.selectedClusterID === -1) {
      return (
        <div></div>
      );
    }

    const selectedCluster = this.props.selectedClusterID + 1;
    const clusterName = "Cluster #" + selectedCluster;
    const selectedDistrict = 1;
    const districtData = clusterMaps[this.props.selectedState]["ensemble1"].clusterData[selectedCluster].districts;

    const clusterNumMaps = data01[this.props.selectedState][selectedCluster]["count"];
    const clusterPolsbyPopper = data01[this.props.selectedState][selectedCluster]["polsbyPopper"];
    const clusterMajMin = data01[this.props.selectedState][selectedCluster]["majMin"];
    const clusterPartisanLean = data01[this.props.selectedState][selectedCluster]["partisanLean"];

    return (
      <Container style={{ height: '80vh' }}>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
              <NavDropdown
                title="X-Axis"
                id="x-axis-nav-dropdown"
                onSelect={this.setXAxisVar}>
                <NavDropdown.Item eventKey={"polsbyPopper"}>
                  Polsby-Popper
                </NavDropdown.Item>
                <NavDropdown.Item eventKey={"majMin"}>
                  Majority-Minority
                </NavDropdown.Item>
                <NavDropdown.Item eventKey={"partisanLean"}>
                  Partisan Lean
                </NavDropdown.Item>
              </NavDropdown>
              <NavDropdown
                title="Y-Axis"
                id="y-axis-nav-dropdown"
                onSelect={this.setYAxisVar}>
                <NavDropdown.Item eventKey={"polsbyPopper"}>
                  Polsby-Popper
                </NavDropdown.Item>
                <NavDropdown.Item eventKey={"majMin"}>
                  Majority-Minority
                </NavDropdown.Item>
                <NavDropdown.Item eventKey={"partisanLean"}>
                  Partisan Lean
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <ResponsiveContainer width="100%" height={'50%'}>
          <ScatterChart
            margin={{
              top: 20,
              right: 10,
              bottom: 10,
              left: 15,
            }}
          >
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey={this.state.xAxisVar}
              name={this.axisLabels[this.state.xAxisVar]}
              label={{ value: this.axisLabels[this.state.xAxisVar], offset: -8, position: 'insideBottomRight' }} />
            <YAxis type="number"
              dataKey={this.state.yAxisVar}
              name={this.axisLabels[this.state.yAxisVar]}
              label={{ value: this.axisLabels[this.state.yAxisVar], offset: -2, angle: -90, position: 'insideBottomLeft' }} />
            <Legend />
            <Scatter name="Districts" fill={districtDotColor} data={districtData} shape={this.renderScatterplotDot} />
          </ScatterChart>
        </ResponsiveContainer>
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
                <td>{clusterPolsbyPopper}</td>
              </tr>
              <tr>
                <td>Majority-Minority Districts</td>
                <td>{clusterMajMin}</td>
              </tr>
              <tr>
                <td>Partisan Lean</td>
                <td>{clusterPartisanLean}</td>
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
