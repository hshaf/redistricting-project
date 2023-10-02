import { Button, Container, Nav, NavDropdown, Navbar, Table } from "react-bootstrap";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts';
import { Component } from "react";

const clusterDotColor = "#8d84d8";

const data01 = {
  "AZ" : [
    {cluster: 1, count: 100, polsbyPopper: 0.5, majMin: 0, partisanLean: -2},
    {cluster: 2, count: 80, polsbyPopper: 0.1, majMin: 5, partisanLean: 4},
    {cluster: 3, count: 160, polsbyPopper: 0.9, majMin: 2, partisanLean: 5},
    {cluster: 4, count: 50, polsbyPopper: 0.7, majMin: 1, partisanLean: -5},
    {cluster: 5, count: 30, polsbyPopper: 0.4, majMin: 3, partisanLean: 4}
  ],
  "VA" : [
    {cluster: 1, count: 200, polsbyPopper: 0.5, majMin: 3, partisanLean: 2},
    {cluster: 2, count: 20, polsbyPopper: 0.3, majMin: 6, partisanLean: -4},
    {cluster: 3, count: 50, polsbyPopper: 0.2, majMin: 3, partisanLean: 2},
    {cluster: 4, count: 150, polsbyPopper: 0.4, majMin: 8, partisanLean: -1},
    {cluster: 5, count: 70, polsbyPopper: 0.6, majMin: 1, partisanLean: 6}
  ],
  "WI" : [
    {cluster: 1, count: 70, polsbyPopper: 0.3, majMin: 0, partisanLean: -3},
    {cluster: 2, count: 150, polsbyPopper: 0.7, majMin: 5, partisanLean: -4},
    {cluster: 3, count: 60, polsbyPopper: 0.8, majMin: 2, partisanLean: -6},
    {cluster: 4, count: 40, polsbyPopper: 0.3, majMin: 1, partisanLean: 5},
    {cluster: 5, count: 120, polsbyPopper: 0.5, majMin: 3, partisanLean: 4}
  ]
}

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
    console.log("Select cluster " + clusterNum);
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
        onClick={() => this.setSelectedCluster(input.payload["cluster"])} />
    );
  }
  render () {
    if (!this.props.selectedState) {
      return (
        <div></div>
      );
    }

    var clusterData = data01[this.props.selectedState]; // Change this later
    const clusterTableEntries = clusterData.map((cluster) => {
      const clusterNum = cluster["cluster"]
      const numMaps = cluster["count"]
      return (
        <tr key={`row-${cluster["cluster"]}`}>
          <td><Button variant="link">{clusterNum}</Button></td>
          <td>{numMaps}</td>
          <td>{cluster[this.state.xAxisVar]}</td>
          <td>{cluster[this.state.yAxisVar]}</td>
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
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="Clusters" data={clusterData} fill={clusterDotColor} shape={this.renderScatterplotDot} />
          </ScatterChart>
        </ResponsiveContainer>
        <div style={{ overflowY: 'auto', minHeight: '30%' }}>
          <Table striped style={{}}>
            <thead>
              <tr>
                <th>Cluster ID</th>
                <th># of maps</th>
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
