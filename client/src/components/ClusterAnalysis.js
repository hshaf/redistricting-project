import { Button, Container, Nav, NavDropdown, Navbar, Table } from "react-bootstrap";
import { useContext, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts';
import { AppStateContext, AppStateDispatch } from "../context/AppStateContext";

const districtDotColor = "#0d6efd";
const axisLabels = {
  "polsbyPopper": "Polsby-Popper",
  "majMin": "Majority-Minority Districts",
  "partisanLean": "Partisan Lean"
}

export default function ClusterAnalysis(props) {
  const appState = useContext(AppStateContext);

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
  let setSelectedPlan = (planNum) => {
    console.log("Select plan " + planNum);
  }
  let renderScatterplotDot = (input) => {
    const cx = input.cx;
    const cy = input.cy;
    return (
      <Dot
        cx={cx} cy={cy}
        r={4}
        stroke="black"
        strokeWidth={1}
        fill={districtDotColor}
        onClick={() => setSelectedPlan(input.payload["planNum"])}
        />
    );
  }
  
  // Render nothing if no state is selected
  // Component should not be accessible in this state
  if (!appState.selectedState || appState.selectedClusterID === "") {
    return (
      <div></div>
    );
  }

  // Get name of selected ensemble
  let selectedEnsemble = props.ensembleData[appState.selectedState][appState.selectedEnsembleID].name;

  const selectedDistrict = 1;
  var clusterData = props.ensembleData[appState.selectedState][appState.selectedEnsembleID].clusters[appState.selectedClusterID] // Change this to get data from request
  var districtData = Object.values(clusterData.plans)
  
  // Fix cluster table values to 3 decimal places if variable is a float
  const clusterName = "Cluster #" + appState.selectedClusterID + " Overview";
  const clusterNumMaps = clusterData["count"];
  const clusterPolsbyPopper = clusterData["polsbyPopper"].toFixed(3);
  const clusterMajMin = clusterData["majMin"].toFixed(3);
  const clusterPartisanLean = clusterData["partisanLean"].toFixed(3);

  // Generate table for district plan statistics
  const districtPlanEntries = districtData.map((districtPlan) => {
    const districtPlanNum = districtPlan["planNum"]
    const xAxisVar = districtPlan[state.xAxisVar];
    const yAxisVar = districtPlan[state.yAxisVar];
    
    // Fix to 0 decimal places if variable is always an integer, 3 decimal places otherwise
    const integerVars = ["majMin", "partisanLean"]
    const xVarDecimals = (integerVars.indexOf(state.xAxisVar) === -1 ? 3 : 0)
    const yVarDecimals = (integerVars.indexOf(state.yAxisVar) === -1 ? 3 : 0)
    return (
      <tr key={`row-${districtPlanNum}`}>
        <td>{districtPlanNum}</td>
        <td>{xAxisVar.toFixed(xVarDecimals)}</td>
        <td>{yAxisVar.toFixed(yVarDecimals)}</td>
      </tr>
    )}
  );

  // Render ClusterAnalysis
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
              onSelect={setYAxisVar}>
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
              <Nav.Link>Cluster ID: {appState.selectedClusterID}</Nav.Link>
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
          <Scatter name="District Plans" fill={districtDotColor} data={districtData} shape={renderScatterplotDot} />
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
              <th>{axisLabels[state.xAxisVar]}</th>
              <th>{axisLabels[state.yAxisVar]}</th>
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
