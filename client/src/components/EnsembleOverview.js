import { Button, Container, Nav, NavDropdown, Navbar, Table } from "react-bootstrap";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts';
import { Component } from "react";

const clusterDotColor = "#8d84d8";

class EnsembleOverview extends Component {
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
  setSelectedCluster = (clusterNum) => {
    this.props.updateSelectedClusterID(clusterNum);
    // Switch to cluster analysis tab
    this.props.updateTab("cluster");
  }
  renderScatterplotDot = (input) => {
    const cx = input.cx;
    const cy = input.cy;
    const isCurrent = (input.payload["count"] === 0)
    var rad = 5;
    if (!isCurrent) {
      rad = 2 * Math.sqrt(input.payload["count"]);
    }
    return (
      <Dot style={{ opacity: 0.6 }}
        cx={cx} cy={cy}
        r={rad}
        stroke="black"
        strokeWidth={1}
        fill={clusterDotColor}
        onClick={() => this.setSelectedCluster(input.payload["clusterNum"])} 
        />
    );
  }
  render () {
    if (!this.props.selectedState) {
      return (
        <div></div>
      );
    }
    
    var clusterData = Object.values(this.props.ensembleData[this.props.selectedState][this.props.selectedEnsembleID].clusters) // Change this to get data from request
    const clusterTableEntries = clusterData.map((cluster) => {
      const clusterNum = cluster["clusterNum"]
      const numMaps = cluster["count"];
      const xAxisVar = cluster[this.state.xAxisVar];
      const yAxisVar = cluster[this.state.yAxisVar];
      return (
        <tr key={`row-${clusterNum}`}>
          <td><Button variant="link" onClick={() => this.setSelectedCluster(clusterNum)}>{clusterNum}</Button></td>
          <td>{numMaps}</td>
          <td>{xAxisVar}</td>
          <td>{yAxisVar}</td>
        </tr>
      )}
    );

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
            <Scatter name="Clusters" data={clusterData} fill={clusterDotColor} shape={this.renderScatterplotDot} />
          </ScatterChart>
        </ResponsiveContainer>
        <h3>Clusters Overview</h3>
        <div style={{ overflowY: 'auto', minHeight: '30%' }}>
          <Table striped style={{}}>
            <thead>
              <tr>
                <th>Cluster ID</th>
                <th># of District Plans</th>
                <th>{this.axisLabels[this.state.xAxisVar]}</th>
                <th>{this.axisLabels[this.state.yAxisVar]}</th>
              </tr>
            </thead>
            <tbody>
              {clusterTableEntries}
            </tbody>
          </Table>
        </div>
      </Container>
    );
  }
}

export default EnsembleOverview;
