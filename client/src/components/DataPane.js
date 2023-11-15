import { Button, Container, Nav, NavDropdown, Navbar, Tab, Tabs } from "react-bootstrap";
import EnsembleOverview from "./EnsembleOverview";
import ClusterAnalysis from "./ClusterAnalysis";
import DistanceMeasures from "./DistanceMeasures";
import { useContext, useState } from "react";
import ensembleData from "../data/ensemble-data.json"
import api from "../serverAPI";
import { AppStateContext, AppStateDispatch, AppStateActionType } from "../context/AppStateContext";
import { AppDataContext, AppDataDispatch } from "../context/AppDataContext";
import EnsembleSelection from "./EnsembleSelection";
import { AppDataActionType } from "../context/AppDataContext";

// Use these constants for checking the value of selectedTab state.
export const DataPaneTabs = {
  ENSEMBLE_SELECTION: 'ENSEMBLE_SELECTION',
  ENSEMBLE_INFO: 'ENSEMBLE_INFO',
  CLUSTER_ANALYSIS: 'CLUSTER_ANALYSIS',
  DISTANCE_MEASURES: 'DISTANCE_MEASURES'
}

export default function DataPane(props) {
  const appState = useContext(AppStateContext);
  const appStateDispatch = useContext(AppStateDispatch);

  const appData = useContext(AppDataContext);
  const dataAPI = useContext(AppDataDispatch);

  const [state, setState] = useState({
    selectedTab: DataPaneTabs.ENSEMBLE_SELECTION
  })

  let updateTab = (tab) => {
    setState({
      ...state,
      selectedTab: tab
    });
  }

  let handleStateDropdown = (event) => {
    console.log(event);
  };

  let handleStateSelection = (event) => {
    // Set state based on provided abbreviation
    appStateDispatch({
      type: AppStateActionType.SET_SELECTED_STATE,
      payload: event
    });

    // Retrieve data test
    dataAPI.getEnsemblesForState(event);

    // Reset tab back to ensemble selection
    updateTab(DataPaneTabs.ENSEMBLE_SELECTION);
  }

  let handleEnsembleDropdown = (event) => {
    console.log(event);
  };

  let handleReset = () => {
    // Deselect current state
    //props.updateSelectedState("");
    appStateDispatch({
      type: AppStateActionType.SET_SELECTED_STATE,
      payload: ""
    });

    dataAPI.appDataDispatch({
      type: AppDataActionType.RESET
    });

    // Reset tab back to ensemble selection
    updateTab(DataPaneTabs.ENSEMBLE_SELECTION);
  };

  // Get strings for displaying selected state and district plan
  let selectedState = ""
  let districtPlan = ""
  if (appState.selectedState !== "") {
    selectedState = appData.stateData.get(appState.selectedState).name;
    districtPlan = appData.stateData.get(appState.selectedState).districtType;
  }
  
  // Render DataPane

  // If no state is selected, we hide the tabs and show
  // the welcome information pane.
  let dataTabs = <div></div>
  let welcomePane = <div></div>

  // If cluster not selected, disable cluster analysis tab
  let disableClusterTab = false;
  if (appState.selectedClusterID === "") {
    disableClusterTab = true;
  }

  console.log(appState);
  console.log(props);

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
        <Tab eventKey={DataPaneTabs.ENSEMBLE_INFO} title="Ensemble Info" >
          <EnsembleOverview
          selectedTab={state.selectedTab}
          updateTab={updateTab}
          ensembleData={ensembleData}
          />
        </Tab>
        <Tab eventKey={DataPaneTabs.CLUSTER_ANALYSIS} title="Cluster Analysis" disabled={disableClusterTab} >
          <ClusterAnalysis
          ensembleData={ensembleData}
          />
        </Tab>
        <Tab eventKey={DataPaneTabs.DISTANCE_MEASURES} title="Distance Measures" >
          <DistanceMeasures
          ensembleData={ensembleData}
          />
        </Tab>
      </Tabs>
  }

  else {
    welcomePane = 
    <Container id="info-box">
      <div id="welcome-text">
        <h4>
          Welcome to Team Giants District Plan Site!
        </h4>
      </div>
      <div id="getting-started-text">
        To get started, choose a state either by using the 'Select State' dropdown menu or by 
        clicking on a state highlighted in blue on the map.
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
                <Nav.Link>District Plan: {districtPlan}</Nav.Link>
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
