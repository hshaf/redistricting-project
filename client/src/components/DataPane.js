import { Container, Nav, NavDropdown, Navbar, Tab, Tabs } from "react-bootstrap";
import EnsembleOverview from "./EnsembleOverview";
import ClusterAnalysis from "./ClusterAnalysis";
import DistanceMeasures from "./DistanceMeasures";
import React, { Component } from "react";

class DataPane extends Component {
  handleStateDropdown = (event) => {
    console.log(event);
  };

  handleStateSelection = (event) => {
    if (event == 'az') {
      // Arizona selected
      this.props.updateSelectedState("AZ");
    }

    if (event == 'va') {
      // Virginia selected
      this.props.updateSelectedState("VA");
    }

    if (event == 'wi') {
      // Wisconsin selected
      this.props.updateSelectedState("WI");
    }
  }

  handleEnsembleDropdown = (event) => {
    console.log(event);
  };

  handleReset = () => {
    // Deselect current state
    this.props.updateSelectedState("");
  };

  render () {
    // Get strings for displaying selecte state and district plan
    let selectedState = ""
    let districtPlan = ""
    if (this.props.selectedState == "VA") {
      selectedState = "Virginia"
      districtPlan = "State Assembly"
    }
    else if (this.props.selectedState == "AZ") {
      selectedState = "Arizona"
      districtPlan = "State Assembly"
    }
    else if (this.props.selectedState == "WI") {
      selectedState = "Wisconsin"
      districtPlan = "State Senate"
    }

    // If no state is selected, we hide the tabs and show
    // the welcome information pane.
    let dataTabs = <div></div>
    let welcomePane = <div></div>

    // If cluster not selected, disable cluster analysis tab
    let disableClusterTab = false;
    if (this.props.selectedClusterID === -1) {
      disableClusterTab = true;
    }

    if (this.props.selectedState) {
      dataTabs =
      <Tabs
        id="DataPaneTabs"
        className="mb-3"
        fill
        >
          <Tab eventKey="ensemble" title="Ensemble Info" >
            <EnsembleOverview 
            selectedState={this.props.selectedState}
            selectedClusterID={this.props.selectedClusterID}
            updateSelectedClusterID={this.props.updateSelectedClusterID}
            />
          </Tab>
          <Tab eventKey="cluster" title="Cluster Analysis" disabled={disableClusterTab} >
            <ClusterAnalysis 
            selectedState={this.props.selectedState} 
            selectedClusterID={this.props.selectedClusterID}
            updateSelectedClusterID={this.props.updateSelectedClusterID}
            />
          </Tab>
          <Tab eventKey="other" title="Distance Measures" >
            <DistanceMeasures 
            selectedState={this.props.selectedState} 
            selectedClusterID={this.props.selectedClusterID}
            updateSelectedClusterID={this.props.updateSelectedClusterID}
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
          {/* <div id="state-info-text">
            <h4>
              State Information
            </h4>
          </div>
          <div id="selected-state-text">
            Selected state: {selectedState}
          </div>
          <div id="district-plan-text">
            District plan: {districtPlan}
          </div>
          <div id="political-results-header">
            <h4>
              Political Results
            </h4>
          </div>
          <div id="political-results-text">
            Estimated using data from 2020 Presidential Election at the precinct level.
          </div> */}
        </Container>
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
                onClick={this.handleReset}>
                  Reset
                </Nav.Link>
    
                <NavDropdown 
                title="Select State" 
                id="state-nav-dropdown" 
                onSelect={this.handleStateSelection}
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
                onSelect={this.handleEnsembleDropdown}>
                  <NavDropdown.Item eventKey={"id1"}>
                    Ensemble 1
                  </NavDropdown.Item>
                  <NavDropdown.Item eventKey={"id2"}>
                    Ensemble 2
                  </NavDropdown.Item>
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
}

export default DataPane;
