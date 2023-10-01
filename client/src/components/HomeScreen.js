import DisplayPane from "./DisplayPane";
import React, { Component } from "react";

class HomeScreen extends Component {
  render() {
    return (
      <div id="homescreen">
        <DisplayPane
        selectedState={this.props.selectedState}
        updateSelectedState={this.props.updateSelectedState}
        />
      </div>
    );
  }
}

export default HomeScreen;
