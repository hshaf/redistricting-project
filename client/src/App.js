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
      If no state or cluster is chosen, then value is -1. 
      Otherwise, value is 0 or greater. 
      
      Note: This value is 0-indexed, meaning you will likely
      be passing in clusterID - 1. */
      selectedClusterID: -1,
      /* Track ID of currently selected ensemble. 
      By default this value is 0 (first ensemble). User can select
      an ID greater than 0 to view different ensemble. */
      selectedEnsembleID: 0
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
      selectedClusterID: -1
    });
  }

  updateSelectedClusterID = (clusterID) => {
    /** 
     * Update the current selected cluster ID.
     * 
     * @param {number}  clusterID   ID of selected cluster.
     */

    this.setState({
      selectedClusterID: clusterID
    });
  }

  updateSelectedEnsembleID = (ensembleID) => {
    /** 
     * Update the current selected ensemble ID.
     * 
     * @param {number}  ensembleID   ID of selected ensemble.
     */

    this.setState({
      selectedEnsembleID: ensembleID
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
