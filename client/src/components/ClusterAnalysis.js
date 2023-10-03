import { Button, Container, Nav, NavDropdown, Navbar, Table } from "react-bootstrap";
import { Component } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts';

const districtDotColor = "#0d6efd";

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

    // Get name of selected ensemble
    let selectedEnsemble = this.props.ensembleData[this.props.selectedState][this.props.selectedEnsembleID].name;

    const selectedDistrict = 1;
    var clusterData = this.props.ensembleData[this.props.selectedState][this.props.selectedEnsembleID].clusters[this.props.selectedClusterID] // Change this to get data from request
    var districtData = Object.values(clusterData.plans)
    
    // Fix cluster table values to 3 decimal places if variable is a float
    const clusterName = "Cluster #" + this.props.selectedClusterID + " Overview";
    const clusterNumMaps = clusterData["count"];
    const clusterPolsbyPopper = clusterData["polsbyPopper"].toFixed(3);
    const clusterMajMin = clusterData["majMin"].toFixed(3);
    const clusterPartisanLean = clusterData["partisanLean"].toFixed(3);

    // Generate table for district plan statistics
    const districtPlanEntries = districtData.map((districtPlan) => {
      const districtPlanNum = districtPlan["planNum"]
      const xAxisVar = districtPlan[this.state.xAxisVar];
      const yAxisVar = districtPlan[this.state.yAxisVar];
      
      // Fix to 0 decimal places if variable is always an integer, 3 decimal places otherwise
      const integerVars = ["majMin", "partisanLean"]
      const xVarDecimals = (integerVars.indexOf(this.state.xAxisVar) === -1 ? 3 : 0)
      const yVarDecimals = (integerVars.indexOf(this.state.yAxisVar) === -1 ? 3 : 0)
      return (
        <tr key={`row-${districtPlanNum}`}>
          <td>{districtPlanNum}</td>
          <td>{xAxisVar.toFixed(xVarDecimals)}</td>
          <td>{yAxisVar.toFixed(yVarDecimals)}</td>
        </tr>
      )}
    );

    return (
      <Container style={{ height: '80vh' }}>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container className="container-fluid">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="container-fluid">
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
              <Nav.Item className="ms-auto">
                <Nav.Link>Ensemble: {selectedEnsemble}</Nav.Link>
              </Nav.Item>
              <Nav.Item className="ms-auto">
                <Nav.Link>Cluster ID: {this.props.selectedClusterID}</Nav.Link>
              </Nav.Item>
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
            <Scatter name="District Plans" fill={districtDotColor} data={districtData} shape={this.renderScatterplotDot} />
          </ScatterChart>
        </ResponsiveContainer>
        <h4>
          {clusterName}
        </h4>
        <div style={{minHeight: '30%' }}>
          <Table striped style={{}}>
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
        </div>
        <h4>
          District Plans
        </h4>
        <div style={{ overflowY: 'auto', minHeight: '30%' }}>
          <Table striped style={{}}>
            <thead>
              <tr>
                <th>District Plan #</th>
                <th>{this.axisLabels[this.state.xAxisVar]}</th>
                <th>{this.axisLabels[this.state.yAxisVar]}</th>
              </tr>
            </thead>
            <tbody>
              {districtPlanEntries}
            </tbody>
          </Table>
        </div>
        <div>Political results estimated using data from 2020 Presidential Election at the precinct level.</div>
      </Container>
    );
  }
}

export default ClusterAnalysis;
