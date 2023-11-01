import React from "react";
import CustomMap from './CustomMap';
import DataPane from "./DataPane";

export default function DisplayPane(props) {
  return (
    <div id="display-pane">
      <div id="visual-pane">
        <DataPane
          selectedState={props.selectedState}
          updateSelectedState={props.updateSelectedState}
          selectedClusterID={props.selectedClusterID}
          updateSelectedClusterID={props.updateSelectedClusterID}
          selectedEnsembleID={props.selectedEnsembleID}
          updateSelectedEnsembleID={props.updateSelectedEnsembleID}
        />
      </div>
      
      <div id="map-pane">
        <CustomMap
          selectedState={props.selectedState}
          updateSelectedState={props.updateSelectedState}
        />
      </div>
    </div>
  );
}
