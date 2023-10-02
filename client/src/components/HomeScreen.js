import DisplayPane from "./DisplayPane";
import React, { Component } from "react";

class HomeScreen extends Component {
  render() {
    return (
      <div id="homescreen">
        <DisplayPane
        selectedState={this.props.selectedState}
        updateSelectedState={this.props.updateSelectedState}
        selectedClusterID={this.props.selectedClusterID}
        updateSelectedClusterID={this.props.updateSelectedClusterID}
        selectedEnsembleID={this.props.selectedEnsembleID}
        updateSelectedEnsembleID={this.props.updateSelectedEnsembleID}
        />
      </div>
    );
  }
}

export default HomeScreen;
