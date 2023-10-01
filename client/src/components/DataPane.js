import { Container, Nav, NavDropdown, Navbar, Tab, Tabs } from "react-bootstrap";
import EnsembleOverview from "./EnsembleOverview";
import ClusterAnalysis from "./ClusterAnalysis";
import DistanceMeasures from "./DistanceMeasures";
import React, { Component } from "react";

class DataPane extends Component {
  handleStateDropdown = (event) => {
    console.log(event);
  };

  handleEnsembleDropdown = (event) => {
    console.log(event);
  };

  handleReset = () => {
    console.log("Reset States");
  };

  render () {
    return (
      <Container id="visual-box">
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand>Team Giants</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link 
                onClick={this.handleReset}>
                  Reset
                </Nav.Link>
    
                <NavDropdown 
                title="State" 
                id="state-nav-dropdown" 
                onSelect={this.handleStateDropdown}>
                  <NavDropdown.Item eventKey={1}>
                    Arizona
                  </NavDropdown.Item>
                  <NavDropdown.Item eventKey={2}>
                    Virginia
                  </NavDropdown.Item>
                  <NavDropdown.Item eventKey={3}>
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
                  <NavDropdown.Item eventKey={"id3"}>
                    These will be generated depending on state selection
                  </NavDropdown.Item> 
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

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
