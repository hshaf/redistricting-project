import { Button, Container, Nav, NavDropdown, Navbar, Table } from "react-bootstrap";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts';
import { useState } from "react";

const clusterDotColor = "#0d6efd";
const axisLabels = {
  "polsbyPopper": "Avg. Polsby-Popper",
  "majMin": "Avg. Majority-Minority Districts",
  "partisanLean": "Avg. Partisan Lean"
}

export default function EnsembleOverview(props) {
  const [state, setState] = useState({
    xAxisVar: "polsbyPopper",
    yAxisVar: "majMin",
  });

  let setXAxisVar = (axisOption) => {
    setState({
      ...state,
      xAxisVar: axisOption
    })
  }
  let setYAxisVar = (axisOption) => {
    setState({
      ...state,
      yAxisVar: axisOption
    })
  }
  let setSelectedCluster = (clusterNum) => {
    props.updateSelectedClusterID(clusterNum);
    // Switch to cluster analysis tab
    props.updateTab("cluster");
  }
  let renderScatterplotDot = (input) => {
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
        onClick={() => setSelectedCluster(input.payload["clusterNum"])} 
        />
    );
  }

  // Render nothing if no state is selected
  // Component should not be accessible in this state
  if (!props.selectedState) {
    return (
      <div></div>
    );
  }
  
  // Generate cluster table
  var clusterData = Object.values(props.ensembleData[props.selectedState][props.selectedEnsembleID].clusters) // Change this to get data from request
  const clusterTableEntries = clusterData.map((cluster) => {
    const clusterNum = cluster["clusterNum"]
    const numMaps = cluster["count"];
    const xAxisVar = cluster[state.xAxisVar];
    const yAxisVar = cluster[state.yAxisVar];
    return (
      <tr key={`row-${clusterNum}`}>
        <td><Button variant="link" onClick={() => setSelectedCluster(clusterNum)}>{clusterNum}</Button></td>
        <td>{numMaps}</td>
        <td>{xAxisVar.toFixed(3)}</td>
        <td>{yAxisVar.toFixed(3)}</td>
      </tr>
    )}
  );

  // Get name of selected ensemble
  let selectedEnsemble = props.ensembleData[props.selectedState][props.selectedEnsembleID].name;

  // Render EnsembleOverview
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
              onSelect={setXAxisVar}>
              <NavDropdown.Item eventKey={"polsbyPopper"}>
                Avg. Polsby-Popper
              </NavDropdown.Item>
              <NavDropdown.Item eventKey={"majMin"}>
                Avg. Majority-Minority
              </NavDropdown.Item>
              <NavDropdown.Item eventKey={"partisanLean"}>
                Avg. Partisan Lean
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title="Y-Axis"
              id="y-axis-nav-dropdown"
              onSelect={setYAxisVar}>
              <NavDropdown.Item eventKey={"polsbyPopper"}>
                Avg. Polsby-Popper
              </NavDropdown.Item>
              <NavDropdown.Item eventKey={"majMin"}>
                Avg. Majority-Minority
              </NavDropdown.Item>
              <NavDropdown.Item eventKey={"partisanLean"}>
                Avg. Partisan Lean
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Item className="ms-auto">
              <Nav.Link>Ensemble: {selectedEnsemble}</Nav.Link>
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
            dataKey={state.xAxisVar}
            name={axisLabels[state.xAxisVar]}
            label={{ value: axisLabels[state.xAxisVar], offset: -8, position: 'insideBottomRight' }} />
          <YAxis type="number"
            dataKey={state.yAxisVar}
            name={axisLabels[state.yAxisVar]}
            label={{ value: axisLabels[state.yAxisVar], offset: -2, angle: -90, position: 'insideBottomLeft' }} />
          <Legend />
          <Scatter name="Clusters" data={clusterData} fill={clusterDotColor} shape={renderScatterplotDot} />
        </ScatterChart>
      </ResponsiveContainer>
      <h4>Clusters Overview</h4>
      <div style={{ overflowY: 'auto', minHeight: '30%' }}>
        <Table striped style={{}}>
          <thead>
            <tr>
              <th>Cluster ID</th>
              <th># of District Plans</th>
              <th>{axisLabels[state.xAxisVar]}</th>
              <th>{axisLabels[state.yAxisVar]}</th>
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
