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
      selectedState: ""
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
      selectedState: stateName
    });
  }

  render () {
    return (
      <HomeScreen 
      selectedState={this.state.selectedState}
      updateSelectedState={this.updateSelectedState}
      />
    );
  }
}

export default App;
