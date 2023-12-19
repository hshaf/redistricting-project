import { Container, Nav, NavDropdown, Navbar, Tab, Tabs } from "react-bootstrap";
import EnsembleOverview from "./EnsembleOverview";
import ClusterAnalysis from "./ClusterAnalysis";
import DistanceMeasures from "./DistanceMeasures";
import { useContext, useState } from "react";
import { AppStateContext, AppStateDispatch, AppStateActionType } from "../context/AppStateContext";
import { AppDataContext, AppDataDispatch } from "../context/AppDataContext";
import EnsembleSelection from "./EnsembleSelection";
import { AppDataActionType } from "../context/AppDataContext";
import { useEffect } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

// Use these constants for checking the value of selectedTab state.
export const DataPaneTabs = {
  ENSEMBLE_SELECTION: 'ENSEMBLE_SELECTION',
  ENSEMBLE_INFO: 'ENSEMBLE_INFO',
  CLUSTER_ANALYSIS: 'CLUSTER_ANALYSIS',
  DISTANCE_MEASURES: 'DISTANCE_MEASURES'
}

export default function DataPane(props) {
  // Contexts
  const appState = useContext(AppStateContext);
  const appStateDispatch = useContext(AppStateDispatch);

  const appData = useContext(AppDataContext);
  const dataAPI = useContext(AppDataDispatch);

  const [state, setState] = useState({
    selectedTab: DataPaneTabs.ENSEMBLE_SELECTION
  })

  // Reset tab if selected state changes
  useEffect(() => {
    updateTab(DataPaneTabs.ENSEMBLE_SELECTION)
  }, [appState.selectedState]);

  /**
   * Update selectedTab state to switch to different tab.
   * 
   * @param {string} tab   Name of tab to switch to.
   */
  let updateTab = (tab) => {
    setState({
      ...state,
      selectedTab: tab
    });
  }

  /** 
   * Update the current selected state. Selected state will update if
   * user clicks an item under the "select state" dropdown.
   * 
   * @param {String}  event     Abbreviated name of selected state.
   */
  let handleStateSelection = (event) => {
    appStateDispatch({
      type: AppStateActionType.SET_SELECTED_STATE,
      payload: event
    });

    dataAPI.getEnsemblesForState(event);

    // Reset tab back to ensemble selection
    updateTab(DataPaneTabs.ENSEMBLE_SELECTION);
  }

  /**
   * Handle when "reset" button is clicked by user.
   */
  let handleReset = () => {
    // Deselect current state
    appStateDispatch({
      type: AppStateActionType.SET_SELECTED_STATE,
      payload: null
    });

    dataAPI.appDataDispatch({
      type: AppDataActionType.RESET
    });

    // Reset tab back to ensemble selection
    updateTab(DataPaneTabs.ENSEMBLE_SELECTION);
  };

  // Get strings for displaying selected state and district plan
  let selectedState = ""
  let districtPlanType = ""
  if (appState.selectedState !== null) {
    selectedState = appData.stateData.get(appState.selectedState).name;
    districtPlanType = appData.stateData.get(appState.selectedState).districtPlanType;
  }
  
  // Render DataPane

  // If no state is selected, we hide the tabs and show
  // the welcome information pane.
  let dataTabs = <div></div>
  let welcomePane = <div></div>

  // If ensemble not selected, disable ensemble info tab
  let disableEnsembleInfoTab = false;
  if (appState.selectedEnsembleID === null) {
    disableEnsembleInfoTab = true;
  }

  // If cluster not selected, disable cluster analysis tab
  let disableClusterTab = false;
  if (appState.selectedClusterID === null) {
    disableClusterTab = true;
  }

  // If ensemble not selected, disable distance measures tab
  let disableDistanceMeasuresTab = false;
  if (appState.selectedEnsembleID === null) {
    disableDistanceMeasuresTab = true;
  }

  // Store state objects in an array for state information table
  let states = [];
  for (const s of appData.stateData.values()) {
    states.push(s);
  }

  let stateData = states.map((state, idx) => {
    return {
      "INDEX": idx,
      "NAME": state["name"],
      "DISTRICT_PLAN_TYPE": state["districtPlanType"],
      "PERCENT_WHITE": state["demographics"]["percentWhite"],
      "PERCENT_BLACK": state["demographics"]["percentBlack"],
      "PERCENT_ASIAN": state["demographics"]["percentAsian"],
      "PERCENT_NATIVE": state["demographics"]["percentNative"],
      "PERCENT_PACIFIC": state["demographics"]["percentPacific"],
      "PERCENT_TWO_OR_MORE": state["demographics"]["percentTwoOrMore"],
      "PERCENT_HISPANIC": state["demographics"]["percentHispanic"],
      "PERCENT_DEM_VOTERS": state["percentDemocraticVoters"],
      "PERCENT_REP_VOTERS": state["percentRepublicanVoters"],
    }
  });

  // Format percentages in tables
  const percentFormatter = (data) => {
    return <>{(data * 100).toFixed(3)}</>
  }

  // Columns for state information table
  const stateInformationColumns = [
    { dataField: "NAME", text: "State Name" },
    { dataField: "DISTRICT_PLAN_TYPE", text: "District Plan Type" },
    { dataField: "PERCENT_DEM_VOTERS", text: "% Dem. Voters", formatter: percentFormatter },
    { dataField: "PERCENT_REP_VOTERS", text: "% Rep. Voters", formatter: percentFormatter }
  ];

  const stateDemographicColumns = [
    { dataField: "NAME", text: "State Name" },
    { dataField: "PERCENT_WHITE", text: "% White", formatter: percentFormatter },
    { dataField: "PERCENT_BLACK", text: "% Black", formatter: percentFormatter },
    { dataField: "PERCENT_HISPANIC", text: "% Hispanic", formatter: percentFormatter },
    { dataField: "PERCENT_ASIAN", text: "% Asian", formatter: percentFormatter },
    { dataField: "PERCENT_NATIVE", text: "% Native", formatter: percentFormatter },
    { dataField: "PERCENT_PACIFIC", text: "% Pacific", formatter: percentFormatter },
    { dataField: "PERCENT_TWO_OR_MORE", text: "% 2+ Races", formatter: percentFormatter }
  ];

  // State information pagination options
  const stateInfoPaginationOptions = {
    sizePerPageList: [
      {text: '10', value: 10},
      {text: '15', value: 15},
      {text: '20', value: 20},
      {text: 'All', value: stateData.length},
    ]
  }

  if (appState.selectedState) {
    dataTabs =
    <Tabs
      id="DataPaneTabs"
      className="mb-3"
      fill
      onSelect={(tab) => updateTab(tab)}
      activeKey={state.selectedTab}
      >
        <Tab eventKey={DataPaneTabs.ENSEMBLE_SELECTION} title="Ensemble Selection" >
          <EnsembleSelection 
          updateTab={updateTab}
          />
        </Tab>
        <Tab eventKey={DataPaneTabs.ENSEMBLE_INFO} title="Ensemble Info" disabled={disableEnsembleInfoTab} >
          <EnsembleOverview
          selectedTab={state.selectedTab}
          updateTab={updateTab}
          />
        </Tab>
        <Tab eventKey={DataPaneTabs.CLUSTER_ANALYSIS} title="Cluster Analysis" disabled={disableClusterTab} >
          <ClusterAnalysis />
        </Tab>
        <Tab eventKey={DataPaneTabs.DISTANCE_MEASURES} title="Distance Measures" disabled={disableDistanceMeasuresTab} >
          <DistanceMeasures />
        </Tab>
      </Tabs>
  }

  else {
    welcomePane = 
    <Container id="info-box">
      <div id="welcome-text">
        <h3>
          Welcome to Team Giants District Plan Site!
        </h3>
      </div>
      <div id="getting-started-text">
        To get started, choose a state either by using the 'Select State' dropdown menu or by 
        clicking on a state highlighted in blue on the map.
      </div>
      <div id='state-info-table'>
        <h4>State Summary Information</h4>
        <BootstrapTable 
        keyField="INDEX"
        data={stateData}
        columns={stateInformationColumns}
        pagination={paginationFactory(stateInfoPaginationOptions)}
        striped={true}
        />
      </div>
      <div id='state-demographics-table'>
        <h4>State Demographics</h4>
        <BootstrapTable 
        keyField="INDEX"
        data={stateData}
        columns={stateDemographicColumns}
        pagination={paginationFactory(stateInfoPaginationOptions)}
        striped={true}
        />
      </div>
    </Container>
  }
  
  // Generate state dopdown
  let stateDropdownItems = [];
  for (const s of appData.stateData.values()) {
    stateDropdownItems.push(
      <NavDropdown.Item key={`state-dropdown-${s.initials}`} eventKey={s.initials}>
        {s.name}
      </NavDropdown.Item>
    );
  }

  return (
    <Container id="visual-box">
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container className="container-fluid">
          <Navbar.Brand><div id="team-name-text">Team Giants</div></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="container-fluid">
              <Nav.Link 
              onClick={handleReset}>
                Reset
              </Nav.Link>
  
              <NavDropdown 
              title="Select State" 
              id="state-nav-dropdown" 
              onSelect={handleStateSelection}
              >
                {stateDropdownItems}
              </NavDropdown>

              <Nav.Item className="ms-auto">
                <Nav.Link>Selected State: {selectedState}</Nav.Link>
              </Nav.Item>
              <Nav.Item className="ms-auto">
                <Nav.Link>District Plan: {districtPlanType}</Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {welcomePane}

      {dataTabs}
    </Container>
  );
}
