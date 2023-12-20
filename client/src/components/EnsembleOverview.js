import { Button, Container, Nav, NavDropdown, Navbar, Table } from "react-bootstrap";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Dot, Tooltip } from 'recharts';
import { useContext, useState } from "react";
import { AppStateActionType, AppStateContext, AppStateDispatch } from "../context/AppStateContext";
import { DataPaneTabs } from "./DataPane";
import { AppDataContext } from "../context/AppDataContext";
import { AppDataDispatch } from "../context/AppDataContext";
import { FaEye } from 'react-icons/fa';
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

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
  "AVG_DEM_DISTRICTS": "Avg. Dem. Districts",
  "AVG_REP_DISTRICTS": "Avg. Rep. Districts",
  "MIN_DEM_DISTRICTS": "Min. Dem. Districts",
  "MIN_REP_DISTRICTS": "Min. Rep. Districts",
  "MAX_DEM_DISTRICTS": "Max. Dem. Districts",
  "MAX_REP_DISTRICTS": "Max. Rep. Districts"
};

const distanceLabels = {
  "optimalTransport": 'Optimal Transport',
  "hamming": 'Hamming',
  "entropy": 'Entropy'
};

const distanceClusterDataKeys = {
  "optimalTransport": 'OPTIMAL_TRANSPORT',
  "hamming": 'HAMMING',
  "entropy": 'ENTROPY'
}

// Use these constants for updating the value of the selected distance measure.
export const DistanceMeasures = {
  OPTIMAL_TRANSPORT: 'optimalTransport',
  HAMMING: 'hamming',
  ENTROPY: 'entropy'
}

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
   * Update the selected distance measure.
   * 
   * @param {String} distanceOption 
   */
  let setDistanceMeasure = (distanceOption) => {
    appStateDispatch({
      type: AppStateActionType.SET_SELECTED_DISTANCE_MEASURE,
      payload: distanceOption
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
   * Update the ID of the generated plan boundary to be displayed on the map.
   * 
   * @param {String}  boundaryId   ID of selected boundary.
   */
  let setDisplayedBoundary = (boundaryId) => {
    appStateDispatch({
      type: AppStateActionType.SET_DISPLAYED_BOUNDARY,
      payload: boundaryId
    })
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
      "CLUSTER_TYPE": cluster["clusterType"],
      "BOUNDARY": cluster["boundary"],
      "DISTRICT_PLAN_COUNT": cluster["districtPlanCount"],
      "CLUSTER_CENTER_X": cluster["clusterCenter"][0],
      "CLUSTER_CENTER_Y": cluster["clusterCenter"][1],
      "MAJ_MIN": cluster["avgMajMinDistricts"]["totalMajMin"],
      "MAJ_BLACK": cluster["avgMajMinDistricts"]["majBlack"],
      "MAJ_NATIVE": cluster["avgMajMinDistricts"]["majNative"],
      "MAJ_ASIAN": cluster["avgMajMinDistricts"]["majAsian"],
      "MAJ_PACIFIC": cluster["avgMajMinDistricts"]["majPacific"],
      "MAJ_HISPANIC": cluster["avgMajMinDistricts"]["majHispanic"],
      "AVG_DEM_DISTRICTS": cluster["avgDemocraticDistricts"],
      "AVG_REP_DISTRICTS": cluster["avgRepublicanDistricts"],
      "MIN_DEM_DISTRICTS": cluster["minDemocraticDistricts"],
      "MIN_REP_DISTRICTS": cluster["minRepublicanDistricts"],
      "MAX_DEM_DISTRICTS": cluster["maxDemocraticDistricts"],
      "MAX_REP_DISTRICTS": cluster["maxRepublicanDistricts"],
      "OPTIMAL_TRANSPORT": cluster["avgDistances"]["optimalTransport"],
      "HAMMING": cluster["avgDistances"]["hamming"],
      "ENTROPY": cluster["avgDistances"]["entropy"]
    }
  });

  // Filter clusters that were generated by distance measure other than the selected one
  let filteredClusterData = clusterData.filter((cluster) => cluster.CLUSTER_TYPE === appState.selectedDistanceMeasure);

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

  // Generate distance measure selection dropdown entries
  const distanceDropdownEntries = Object.entries(distanceLabels).map((measure) => {
    const isMeasurePresent = (selectedEnsemble["avgDistances"][measure[0]] === null);
    return (
      <NavDropdown.Item key={measure[0]} eventKey={measure[0]} disabled={isMeasurePresent}>
        {(measure[0] === appState.selectedDistanceMeasure) ? measure[1] + ' •' : measure[1]}
      </NavDropdown.Item>
    )
  })

  // Pagination options
  const paginationOptions = {
    sizePerPageList: [
      {text: '5', value: 5},
      {text: '10', value: 10},
      {text: '15', value: 15},
      {text: '20', value: 20},
      {text: 'All', value: filteredClusterData.length},
    ]
  }

  // Formatters for the cluster table
  const clusterIdxFormatter = (data, row) => {
    return <a href="#" onClick={() => setSelectedCluster(data)}>{(data + 1)}</a>
  }

  const dataPrecisionFormatter = (data, row) => {
    if (Number.isInteger(data)) {
      return <>{data}</>
    } else {
      return <>{data.toFixed(3)}</>
    }
  }

  const linkVisualizeButton = (data, row) => {
    // Disable button if boundary set to null
    const boundaryId = clusterData[row.INDEX]["BOUNDARY"];
    const disableBtn = (boundaryId) ? false : true;

    return (
      <Button
        onClick={() => setDisplayedBoundary(boundaryId)}
        disabled={disableBtn}
      >
        <FaEye />
      </Button>
    );
  }

  // Columns for the cluster table
  const columnsOneVar = [ // Used when the same variable is selected for both axes
    { dataField: "INDEX", text: "Cluster ID", formatter: clusterIdxFormatter },
    { dataField: "DISTRICT_PLAN_COUNT", text: "# of District Plans" },
    { dataField: distanceClusterDataKeys[appState.selectedDistanceMeasure], text: "Avg. Pair Distance", formatter: dataPrecisionFormatter },
    { dataField: state.xAxisVar, text: axisLabels[state.xAxisVar], formatter: dataPrecisionFormatter },
    { dataField: "visualize_button", text: "Show Boundary", formatter: linkVisualizeButton }
  ];
  const columnsTwoVars = [
    { dataField: "INDEX", text: "Cluster ID", formatter: clusterIdxFormatter },
    { dataField: "DISTRICT_PLAN_COUNT", text: "# of District Plans" },
    { dataField: distanceClusterDataKeys[appState.selectedDistanceMeasure], text: "Avg. Pair Distance", formatter: dataPrecisionFormatter },
    { dataField: state.xAxisVar, text: axisLabels[state.xAxisVar], formatter: dataPrecisionFormatter },
    { dataField: state.yAxisVar, text: axisLabels[state.yAxisVar], formatter: dataPrecisionFormatter },
    { dataField: "visualize_button", text: "Show Boundary", formatter: linkVisualizeButton }
  ];
  const columns = (state.xAxisVar === state.yAxisVar) ? columnsOneVar : columnsTwoVars

  // Custom tooltip for cluster scatter plot
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const xValue = (Number.isInteger(payload[0].payload[state.xAxisVar])) ? payload[0].payload[state.xAxisVar] : payload[0].payload[state.xAxisVar].toFixed(3);
      const yValue = (Number.isInteger(payload[0].payload[state.yAxisVar])) ? payload[0].payload[state.yAxisVar] : payload[0].payload[state.yAxisVar].toFixed(3);
      return (
        <div className="custom-tooltip">
          <p style={{ fontSize: '14px', paddingTop: 4, paddingLeft: 4, paddingRight: 4, paddingBottom: 0 }} className="label">{`Cluster ID : ${(payload[0].payload.INDEX + 1)}`}</p>
          <p style={{ fontSize: '14px', paddingTop: 0, paddingLeft: 4, paddingRight: 4, paddingBottom: 0 }} className="label">{`${axisLabels[state.xAxisVar]} : ${xValue}`}</p>
          <p style={{ fontSize: '14px', paddingTop: 0, paddingLeft: 4, paddingRight: 4, paddingBottom: 4 }} className="label">{`${axisLabels[state.yAxisVar]} : ${yValue}`}</p>
        </div>
      );
    }
  
    return null;
  };

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
            <NavDropdown
              title="Select Distance Measure"
              id="distance-measure-nav-dropdown"
              onSelect={setDistanceMeasure}>
              {distanceDropdownEntries}
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
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Scatter name="Clusters" data={filteredClusterData} fill={clusterDotColor} shape={renderScatterplotDot} />
        </ScatterChart>
      </ResponsiveContainer>
      <h4>Clusters Overview</h4>
      <BootstrapTable 
        keyField="INDEX"
        data={filteredClusterData}
        columns={columns}
        pagination={paginationFactory(paginationOptions)}
        striped={true}
      />
    </Container>
  );
}
