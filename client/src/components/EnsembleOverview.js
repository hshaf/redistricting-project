import { Button, Container, Nav, NavDropdown, Navbar, Table } from "react-bootstrap";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Dot } from 'recharts';
import { useContext, useState } from "react";
import { AppStateActionType, AppStateContext, AppStateDispatch } from "../context/AppStateContext";
import { DataPaneTabs } from "./DataPane";
import { AppDataContext } from "../context/AppDataContext";
import { AppDataDispatch } from "../context/AppDataContext";

const clusterDotColor = "#0d6efd";
const axisLabels = {
  "polsbyPopper": "Avg. Polsby-Popper",
  "majMin": "Avg. Majority-Minority Districts",
  "partisanLean": "Avg. Partisan Lean"
}

export default function EnsembleOverview(props) {
  const appState = useContext(AppStateContext);
  const appStateDispatch = useContext(AppStateDispatch);
  const appData = useContext(AppDataContext);
  const dataAPI = useContext(AppDataDispatch);

  let selectedEnsemble = null;
  let clusters = null;

  if (appState.selectedEnsembleID && appData.selectedStateEnsembles) {
    selectedEnsemble = appData.selectedStateEnsembles[appState.selectedEnsembleID];
  }

  if (appData.selectedEnsembleClusters) {
    clusters = appData.selectedEnsembleClusters;
  }

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
    console.log('selected cluster id=' + clusterNum);
    appStateDispatch({
      type: AppStateActionType.SET_SELECTED_CLUSTER,
      payload: clusterNum
    })
    
    dataAPI.getDistrictPlansForCluster(clusters[clusterNum]['id']);

    // Switch to cluster analysis tab
    props.updateTab(DataPaneTabs.CLUSTER_ANALYSIS);
  }
  let renderScatterplotDot = (input) => {
    const cx = input.cx;
    const cy = input.cy;
    const isCurrent = (input.payload["districtCount"] === 0)
    const dotKey = clusters.indexOf(input.payload).toString();
    var rad = 5;
    if (!isCurrent) {
      rad = 2 * Math.sqrt(input.payload["districtCount"]);
    }
    return (
      <Dot style={{ opacity: 0.6 }}
        cx={cx} cy={cy}
        r={rad}
        stroke="black"
        strokeWidth={1}
        fill={clusterDotColor}
        onClick={() => setSelectedCluster(dotKey)} 
        />
    );
  }

  // Render nothing if no state is selected
  // Component should not be accessible in this state
  if (!appState.selectedState) {
    return (
      <div></div>
    );
  }
  
  // Generate cluster table
  var clusterData = [];

  if (clusters) {
    clusterData = clusters;
  }
  
  const clusterTableEntries = clusterData.map((cluster, idx) => {
    const numMaps = cluster["districtCount"];
    const xAxisVar = cluster[state.xAxisVar];
    const yAxisVar = cluster[state.yAxisVar];
    return (
      <tr key={`row-${idx}`}>
        <td><Button variant="link" onClick={() => setSelectedCluster(idx.toString())}>{(idx + 1)}</Button></td>
        <td>{numMaps}</td>
        <td>{xAxisVar.toFixed(3)}</td>
        <td>{yAxisVar.toFixed(3)}</td>
      </tr>
    )}
  );

  // Get name of selected ensemble 
  let selectedEnsembleName = "";
  
  if (selectedEnsemble) {
    selectedEnsembleName = selectedEnsemble['name'];
  }

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
              <Nav.Link>Ensemble: {selectedEnsembleName}</Nav.Link>
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
