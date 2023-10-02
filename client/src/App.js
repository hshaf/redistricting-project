import logo from './logo.svg';
import './App.css';
import HomeScreen from './components/HomeScreen';
import React, { Component } from "react";

class App extends Component {
  constructor () {
    /* This is where we begin to maintain a global state for the site.
    Certain states will be passed to specific components as needed. */
    super();
    this.state = {
      /* Track currently selected state ("VA", "AZ", or "WI").
      If no state is selected, then value is "". */
      selectedState: "",
      /* Track ID of currently selected cluster. 
      If no state or cluster is chosen, then value is "". 
      Otherwise, value is "1" or greater. */
      selectedClusterID: "",
      /* Track ID of currently selected ensemble. 
      By default this value is "1" (first ensemble). User can select
      an ID greater than "1" to view different ensemble. */
      selectedEnsembleID: "1"
    };
  }

  updateSelectedState = (stateName) => {
    /** 
     * Update the current selected state. Selected state will update if
     * user clicks button on "select state" dropdown, or clicks on a state
     * boundary.
     * 
     * @param {String}  stateName   Abbreviated name of selected state.
     */

    console.log('in updateSelectedState()');

    if (stateName == this.state.selectedState) return;

    this.setState({
      selectedState: stateName,
      selectedEnsembleID: "1",
      selectedClusterID: ""
    });
  }

  updateSelectedClusterID = (clusterID) => {
    /** 
     * Update the current selected cluster ID.
     * 
     * @param {String}  clusterID   ID of selected cluster.
     */

    this.setState({
      selectedClusterID: clusterID
    });
  }

  updateSelectedEnsembleID = (ensembleID) => {
    /** 
     * Update the current selected ensemble ID.
     * 
     * @param {String}  ensembleID   ID of selected ensemble.
     */

    this.setState({
      selectedEnsembleID: ensembleID,
      selectedClusterID: ""
    });
  }

  render () {
    return (
      <HomeScreen 
      selectedState={this.state.selectedState}
      updateSelectedState={this.updateSelectedState}
      selectedClusterID={this.state.selectedClusterID}
      updateSelectedClusterID={this.updateSelectedClusterID}
      selectedEnsembleID={this.state.selectedEnsembleID}
      updateSelectedEnsembleID={this.updateSelectedEnsembleID}
      />
    );
  }
}

export default App;
