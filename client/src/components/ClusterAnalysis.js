import { Button, Container, Nav, NavDropdown, Navbar, Table } from "react-bootstrap";
import { Component } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts';

const districtDotColor = "#8d84d8";

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
        onClick={() => this.setSelectedPlan(input.payload["planNum"])}
        />
    );
  }
  render () {
    if (!this.props.selectedState || this.props.selectedClusterID === "") {
      return (
        <div></div>
      );
    }

    const selectedDistrict = 1;
    var clusterData = this.props.ensembleData[this.props.selectedState][this.props.selectedEnsembleID].clusters[this.props.selectedClusterID] // Change this to get data from request
    var districtData = Object.values(clusterData.plans)
    
    const clusterName = "Cluster #" + this.props.selectedClusterID;
    const clusterNumMaps = clusterData["count"];
    const clusterPolsbyPopper = clusterData["polsbyPopper"];
    const clusterMajMin = clusterData["majMin"];
    const clusterPartisanLean = clusterData["partisanLean"];

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
                <td>Number of Plans</td>
                <td>{clusterNumMaps}</td>
              </tr>
              <tr>
                <td>Mean Polsby-Popper</td>
                <td>{clusterPolsbyPopper}</td>
              </tr>
              <tr>
                <td>Mean Majority-Minority Districts</td>
                <td>{clusterMajMin}</td>
              </tr>
              <tr>
                <td>Mean Partisan Lean</td>
                <td>{clusterPartisanLean}</td>
              </tr>
            </tbody>
          </Table>
          <Table striped style={{}}>
            <thead>
              <tr>
                <th>District #{clusterData.DISTRICT}</th>
                <th>Pop</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total</td>
                <td>{clusterData.pop_total}</td>
                <td>100.0</td>
              </tr>
              <tr>
                <td>White</td>
                <td>Info2</td>
                <td>{(100 * clusterData.pct_white).toFixed(1)}</td>
              </tr>
              <tr>
                <td>Black</td>
                <td>Info2</td>
                <td>{(100 * clusterData.pct_black).toFixed(1)}</td>
              </tr>
              <tr>
                <td>Native</td>
                <td>Info2</td>
                <td>{(100 * clusterData.pct_native).toFixed(1)}</td>
              </tr>
              <tr>
                <td>Asian</td>
                <td>Info2</td>
                <td>{(100 * clusterData.pct_asian).toFixed(1)}</td>
              </tr>
              <tr>
                <td>Pacific</td>
                <td>Info2</td>
                <td>{(100 * clusterData.pct_pacific).toFixed(1)}</td>
              </tr>
              <tr>
                <td>Two or more races</td>
                <td>Info2</td>
                <td>{(100 * clusterData.pct_two_or_more).toFixed(1)}</td>
              </tr>
              <tr>
                <td>Hispanic</td>
                <td>Info2</td>
                <td>{(100 * clusterData.pct_hispanic).toFixed(1)}</td>
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
                <td>{(100 * clusterData.pct_vote_dem).toFixed(1)}</td>
              </tr>
              <tr>
                <td>Republican</td>
                <td>Info2</td>
                <td>{(100 * clusterData.pct_vote_rep).toFixed(1)}</td>
              </tr>
              <tr>
                <td>Other</td>
                <td>Info2</td>
                <td>{(100 * clusterData.pct_vote_other).toFixed(1)}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Container>
    );
  }
}

export default ClusterAnalysis;
