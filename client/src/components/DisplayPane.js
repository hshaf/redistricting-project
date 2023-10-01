import DataPane from "./DataPane";
import CustomMap from './CustomMap';
import React, { Component } from "react";

class DisplayPane extends Component {
  render () {
    return (
      <div id="display-pane">
        <div id="visual-pane">
        <DataPane></DataPane>
        </div>
        
        <div id="map-pane">
        <CustomMap></CustomMap>
        </div>
      </div>
    );
  }
}

export default DisplayPane;
