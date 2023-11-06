import { Button, Container, Nav, NavDropdown, Navbar, Tab, Tabs } from "react-bootstrap";
import EnsembleOverview from "./EnsembleOverview";
import ClusterAnalysis from "./ClusterAnalysis";
import DistanceMeasures from "./DistanceMeasures";
import { useState } from "react";
import ensembleData from "../data/ensemble-data.json"
import api from "../serverAPI";

// Use these constants for checking the value of selectedTab state.
const ENSEMBLE = 'ensemble';
const CLUSTER = 'cluster';
const DISTANCE = 'distance';

export default function DataPane(props) {
  const [state, setState] = useState({
    selectedTab: ENSEMBLE
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
    if (event === 'az') {
      // Arizona selected
      props.updateSelectedState("AZ");
    }

    if (event === 'va') {
      // Virginia selected
      props.updateSelectedState("VA");
    }

    if (event === 'wi') {
      // Wisconsin selected
      props.updateSelectedState("WI");
    }

    // Reset tab back to ensemble info
    updateTab(ENSEMBLE);
  }

  let handleEnsembleSelection = (event) => {
    props.updateSelectedEnsembleID(event);

    // Reset tab back to ensemble info
    updateTab(ENSEMBLE);
  };

  let handleEnsembleDropdown = (event) => {
    console.log(event);
  };

  let handleReset = () => {
    // Deselect current state
    props.updateSelectedState("");

    // Reset tab back to ensemble info
    updateTab(ENSEMBLE);
  };

  // Get strings for displaying selected state and district plan
  let selectedState = ""
  let districtPlan = ""
  if (props.selectedState === "VA") {
    selectedState = "Virginia";
    districtPlan = "State Assembly";
  }
  else if (props.selectedState === "AZ") {
    selectedState = "Arizona";
    districtPlan = "State Assembly";
  }
  else if (props.selectedState === "WI") {
    selectedState = "Wisconsin";
    districtPlan = "State Senate";
  }
  
  // Render DataPane

  // If no state is selected, we hide the tabs and show
  // the welcome information pane.
  let dataTabs = <div></div>
  let welcomePane = <div></div>

  // If cluster not selected, disable cluster analysis tab
  let disableClusterTab = false;
  if (props.selectedClusterID === "") {
    disableClusterTab = true;
  }

  if (props.selectedState) {
    dataTabs =
    <Tabs
      id="DataPaneTabs"
      className="mb-3"
      fill
      onSelect={(tab) => updateTab(tab)}
      activeKey={state.selectedTab}
      >
        <Tab eventKey="ensemble" title="Ensemble Info" >
          <EnsembleOverview 
          selectedState={props.selectedState}
          selectedEnsembleID={props.selectedEnsembleID}
          selectedClusterID={props.selectedClusterID}
          updateSelectedClusterID={props.updateSelectedClusterID}
          selectedTab={state.selectedTab}
          updateTab={updateTab}
          ensembleData={ensembleData}
          />
        </Tab>
        <Tab eventKey="cluster" title="Cluster Analysis" disabled={disableClusterTab} >
          <ClusterAnalysis 
          selectedState={props.selectedState} 
          selectedEnsembleID={props.selectedEnsembleID}
          selectedClusterID={props.selectedClusterID}
          updateSelectedClusterID={props.updateSelectedClusterID}
          ensembleData={ensembleData}
          />
        </Tab>
        <Tab eventKey="distance" title="Distance Measures" >
          <DistanceMeasures 
          selectedState={props.selectedState} 
          selectedEnsembleID={props.selectedEnsembleID}
          selectedClusterID={props.selectedClusterID}
          updateSelectedClusterID={props.updateSelectedClusterID}
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

  // If no state is selected, disable ensemble dropdown in navbar
  let ensembleDropDisable = false;
  let ensembleDropdownItems = <div></div>;
  if (!props.selectedState) {
    ensembleDropDisable = true;
  }
  // Otherwise, populate dropdown
  else {
    ensembleDropdownItems = Object.values(ensembleData[props.selectedState]).map((entry) => {
      const entryKey = entry["ensembleNum"];
      const entryLabel = entry["name"];
      return (
        <NavDropdown.Item key={`ensemble-${entryKey}`} eventKey={entryKey}>
          {entryLabel}
        </NavDropdown.Item>);
    });
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
                <NavDropdown.Item eventKey={'az'}>
                  Arizona
                </NavDropdown.Item>
                <NavDropdown.Item eventKey={'va'}>
                  Virginia
                </NavDropdown.Item>
                <NavDropdown.Item eventKey={'wi'}>
                  Wisconsin
                </NavDropdown.Item> 
              </NavDropdown>

              <NavDropdown 
                title="Ensemble" 
                id="ensemble-nav-dropdown" 
                onSelect={handleEnsembleSelection}
                disabled={ensembleDropDisable}
              >
                {ensembleDropdownItems}
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
