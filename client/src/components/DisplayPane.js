import DataPane from "./DataPane";
import CustomMap from './CustomMap';
import React, { Component } from "react";

class DisplayPane extends Component {
  render () {
    return (
      <div id="display-pane">
        <div id="visual-pane">
          <DataPane
            selectedState={this.props.selectedState}
            updateSelectedState={this.props.updateSelectedState}
            selectedClusterID={this.props.selectedClusterID}
            updateSelectedClusterID={this.props.updateSelectedClusterID}
            selectedEnsembleID={this.props.selectedEnsembleID}
            updateSelectedEnsembleID={this.props.updateSelectedEnsembleID}
          />
        </div>
        
        <div id="map-pane">
          <CustomMap
            selectedState={this.props.selectedState}
            updateSelectedState={this.props.updateSelectedState}
          />
        </div>
      </div>
    );
  }
}

export default DisplayPane;
