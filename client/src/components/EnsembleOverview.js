import { Button, Container, Nav, NavDropdown, Navbar, Table } from "react-bootstrap";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Dot } from 'recharts';
import { useContext, useState } from "react";
import { AppStateActionType, AppStateContext, AppStateDispatch } from "../context/AppStateContext";
import { DataPaneTabs } from "./DataPane";
import { AppDataContext } from "../context/AppDataContext";
import { AppDataDispatch } from "../context/AppDataContext";

const clusterDotColor = "#0d6efd";
const axisLabels = {
  "CLUSTER_CENTER_X": "MDS X-Coordinate",
  "CLUSTER_CENTER_Y": "MDS Y-Coordinate",
  "MAJ_MIN": "Avg. Maj.-Min. Districts",
  "MAJ_BLACK": "Avg. Maj.-Black Districts",
  "MAJ_NATIVE": "Avg. Maj.-Native American Districts",
  "MAJ_ASIAN": "Avg. Maj.-Asian Districts",
  "MAJ_PACIFIC": "Avg. Maj.-Pacific Islander Districts",
  "MAJ_HISPANIC": "Avg. Maj.-Hispanic Districts",
  "PARTISAN_LEAN": "Avg. Partisan Lean"
};

export default function EnsembleOverview(props) {
  // Contexts
  const appState = useContext(AppStateContext);
  const appStateDispatch = useContext(AppStateDispatch);

  const appData = useContext(AppDataContext);
  const dataAPI = useContext(AppDataDispatch);

  let selectedEnsemble = null;
  let clusters = [];
  let clusterData = [];

  const [state, setState] = useState({
    xAxisVar: "CLUSTER_CENTER_X",
    yAxisVar: "CLUSTER_CENTER_Y",
  });

  /**
   * Set x-axis for scatterplot.
   * 
   * @param {String} axisOption 
   */
  let setXAxisVar = (axisOption) => {
    setState({
      ...state,
      xAxisVar: axisOption
    })
  }

  /**
   * Set y-axis for scatterplot.
   * 
   * @param {String} axisOption 
   */
  let setYAxisVar = (axisOption) => {
    setState({
      ...state,
      yAxisVar: axisOption
    })
  }

  /** 
   * Update the current selected cluster ID.
   * 
   * @param {String}  clusterNum     ID of selected cluster.
   */
  let setSelectedCluster = (clusterNum) => {
    appStateDispatch({
      type: AppStateActionType.SET_SELECTED_CLUSTER,
      payload: clusterNum
    })
    
    dataAPI.getDistrictPlansForCluster(clusters[clusterNum]['id']);

    // Switch to cluster analysis tab
    props.updateTab(DataPaneTabs.CLUSTER_ANALYSIS);
  }

  /**
   * Populate cluster scatterplot with dot.
   * 
   * @param {object}    input  Cluster data.
   * @returns {object}         Dot object.
   */
  let renderScatterplotDot = (input) => {
    const cx = input.cx;
    const cy = input.cy;
    const dotKey = input.payload["INDEX"];
    let rad = 2 * Math.sqrt(input.payload["DISTRICT_PLAN_COUNT"]);
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

  // Render nothing if no state or ensemble is selected or if necessary data is not yet available
  if (appState.selectedState === null || appState.selectedEnsembleID === null || !appData.selectedStateEnsembles || !appData.selectedEnsembleClusters) {
    return (
      <div></div>
    );
  }

  // Get data for ensemble and associated clusters from global app data
  selectedEnsemble = appData.selectedStateEnsembles[appState.selectedEnsembleID];
  clusters = appData.selectedEnsembleClusters;
  clusterData = clusters.map((cluster, idx) => {
    return {
      "INDEX": idx,
      "DISTRICT_PLAN_COUNT": cluster["districtPlanCount"],
      "CLUSTER_CENTER_X": cluster["clusterCenter"][0],
      "CLUSTER_CENTER_Y": cluster["clusterCenter"][1],
      "MAJ_MIN": cluster["avgMajMinDistricts"]["totalMajMin"],
      "MAJ_BLACK": cluster["avgMajMinDistricts"]["majBlack"],
      "MAJ_NATIVE": cluster["avgMajMinDistricts"]["majNative"],
      "MAJ_ASIAN": cluster["avgMajMinDistricts"]["majAsian"],
      "MAJ_PACIFIC": cluster["avgMajMinDistricts"]["majPacific"],
      "MAJ_HISPANIC": cluster["avgMajMinDistricts"]["majHispanic"],
      "PARTISAN_LEAN": cluster["avgPartisanLean"]
    }
  });

  // Get name of selected ensemble
  let selectedEnsembleName = "";
  if (selectedEnsemble) {
    selectedEnsembleName = selectedEnsemble['name'];
  }

  // Generate axis field selection dropdown entries
  const axisDropdownEntries = Object.entries(axisLabels).map((axisOption) => {
    return (
      <NavDropdown.Item key={axisOption[0]} eventKey={axisOption[0]}>
        {axisOption[1]}
      </NavDropdown.Item>
    )
  })
  
  // Generate cluster table entries
  const clusterTableEntries = clusterData.map((clusterEntry) => {
    const index = clusterEntry["INDEX"];
    const numMaps = clusterEntry["DISTRICT_PLAN_COUNT"];
    const xAxisVar = clusterEntry[state.xAxisVar];
    const yAxisVar = clusterEntry[state.yAxisVar];
    return (
      <tr key={`row-${index}`}>
        <td><Button variant="link" onClick={() => setSelectedCluster(index)}>{(index + 1)}</Button></td>
        <td>{numMaps}</td>
        <td>{xAxisVar.toFixed(3)}</td>
        <td>{yAxisVar.toFixed(3)}</td>
      </tr>
    )}
  );

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
              {axisDropdownEntries}
            </NavDropdown>
            <NavDropdown
              title="Y-Axis"
              id="y-axis-nav-dropdown"
              onSelect={setYAxisVar}>
              {axisDropdownEntries}
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
