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

    return (
      <Container id="visual-box">
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand><div id="team-name-text">Team Giants</div></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
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
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container id="info-box">
          <div id="welcome-text">
            <h4>
              Welcome to Team Giant's redistricting site!
            </h4>
          </div>
          <div id="getting-started-text">
            To get started, select a state by either navigating through the "Select State" 
            dropdown menu or clicking within the boundaries of an outlined state on the map.
          </div>
          <div id="state-info-text">
            <h4>
              State information
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
          </div>
        </Container>

        <Tabs
        id="DataPaneTabs"
        className="mb-3"
        fill
        >
          <Tab eventKey="ensemble" title="Ensemble Info">
            <EnsembleOverview 
                selectedState={this.props.selectedState}
                updateSelectedState={this.props.updateSelectedState}/>
          </Tab>
          <Tab eventKey="cluster" title="Cluster Analysis">
            <ClusterAnalysis />
          </Tab>
          <Tab eventKey="other" title="Distance Measures">
            <DistanceMeasures />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

export default DataPane;
