import { Container, Nav, NavDropdown, Navbar, Table } from "react-bootstrap";
import { useContext, useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Dot } from 'recharts';
import { AppStateContext } from "../context/AppStateContext";
import { AppDataContext } from "../context/AppDataContext";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

const mapPresentDotColor = "#dd6efd";
const districtDotColor = "#0d6efd";
const axisLabels = {
  "MDS_X": "MDS X-Coordinate",
  "MDS_Y": "MDS Y-Coordinate",
  "MAJ_MIN": "Maj.-Min. Districts",
  "MAJ_BLACK": "Maj.-Black Districts",
  "MAJ_NATIVE": "Maj.-Native American Districts",
  "MAJ_ASIAN": "Maj.-Asian Districts",
  "MAJ_PACIFIC": "Maj.-Pacific Islander Districts",
  "MAJ_HISPANIC": "Maj.-Hispanic Districts",
  "PARTISAN_LEAN": "Partisan Lean"
};

export default function ClusterAnalysis(props) {
  // Context
  const appState = useContext(AppStateContext);
  const appData = useContext(AppDataContext);

  let selectedEnsemble = null;
  let selectedCluster = null;
  let districtPlans = [];
  let districtPlanData = [];

  const [state, setState] = useState({
    xAxisVar: "MDS_X",
    yAxisVar: "MDS_Y",
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
   * Update the current selected district plan ID.
   * 
   * @param {String}  planNum     ID of selected district plan.
   */
  let setSelectedPlan = (planNum) => {
    console.log("Select plan " + planNum);
  }

  /**
   * Populate district plan scatterplot with dot.
   * 
   * @param {object}    input  District plan data.
   * @returns {object}         Dot object.
   */
  let renderScatterplotDot = (input) => {
    const cx = input.cx;
    const cy = input.cy;
    const dotKey = input.payload["INDEX"];
    const dotColor = (input.payload["BOUNDARY"]) ? mapPresentDotColor : districtDotColor
    return (
      <Dot
        cx={cx} cy={cy}
        r={(input.payload["BOUNDARY"]) ? 6 : 4}
        stroke="black"
        strokeWidth={1}
        fill={dotColor}
        onClick={() => setSelectedPlan(dotKey)}
        />
    );
  }
  
  // Render nothing if no state, ensemble, or cluster is selected
  if (appState.selectedState === null || 
      appState.selectedEnsembleID === null || 
      appState.selectedClusterID === null || 
      !appData.selectedStateEnsembles || 
      !appData.selectedEnsembleClusters ||
      !appData.selectedClusterDistrictPlans) {
    return (
      <div></div>
    );
  }

  // Get data for cluster and associated district plans from global app data
  selectedEnsemble = appData.selectedStateEnsembles[appState.selectedEnsembleID];
  selectedCluster = appData.selectedEnsembleClusters[appState.selectedClusterID];
  districtPlans = appData.selectedClusterDistrictPlans;
  districtPlanData = districtPlans.map((planEntry, idx) => {
    return {
      "INDEX": idx,
      "BOUNDARY": planEntry["boundary"],
      "MDS_X": planEntry["mdsCoords"][0],
      "MDS_Y": planEntry["mdsCoords"][1],
      "MAJ_MIN": planEntry["majMinDistricts"]["totalMajMin"],
      "MAJ_BLACK": planEntry["majMinDistricts"]["majBlack"],
      "MAJ_NATIVE": planEntry["majMinDistricts"]["majNative"],
      "MAJ_ASIAN": planEntry["majMinDistricts"]["majAsian"],
      "MAJ_PACIFIC": planEntry["majMinDistricts"]["majPacific"],
      "MAJ_HISPANIC": planEntry["majMinDistricts"]["majHispanic"],
      "PARTISAN_LEAN": planEntry["partisanLean"]
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
  
  // Fix cluster table values to 3 decimal places if variable is a float
  const clusterName = "Cluster #" + (Number(appState.selectedClusterID) + 1) + " Overview";
  const clusterNumMaps = selectedCluster["districtPlanCount"];
  const clusterMajMin = selectedCluster["avgMajMinDistricts"]["totalMajMin"].toFixed(3);
  const clusterPartisanLean = selectedCluster["avgPartisanLean"].toFixed(3);

  // Formatters for district plan table
  const districtPlanIdxFormatter = (data, row) => {
    return <>{data + 1}</>
  }

  const dataPrecisionFormatter = (data, row) => {
    if (Number.isInteger(data)) {
      return <>{data}</>
    } else {
      return <>{data.toFixed(3)}</>
    }
  }

  // Columns for district plan table
  const columns = [
    { dataField: "INDEX", text: "District Plan #", formatter: districtPlanIdxFormatter },
    { dataField: state.xAxisVar, text: axisLabels[state.xAxisVar], formatter: dataPrecisionFormatter },
    { dataField: state.yAxisVar, text: axisLabels[state.yAxisVar], formatter: dataPrecisionFormatter }
  ];

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
            <Nav.Item className="ms-auto">
              <Nav.Link>Cluster ID: {Number(appState.selectedClusterID) + 1}</Nav.Link>
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
          <Scatter name="District Plans" fill={districtDotColor} data={districtPlanData} shape={renderScatterplotDot} />
        </ScatterChart>
      </ResponsiveContainer>
      <h4>
        {clusterName}
      </h4>
      <Table striped style={{}}>
        <tbody>
          <tr>
            <td>Number of Plans</td>
            <td>{clusterNumMaps}</td>
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
      <h4>
        District Plans
      </h4>
      <BootstrapTable 
        keyField="INDEX"
        data={districtPlanData}
        columns={columns}
        pagination={paginationFactory()}
        striped={true}
      />
      <div>Political results estimated using data from 2020 Presidential Election at the precinct level.</div>
    </Container>
  );
}
