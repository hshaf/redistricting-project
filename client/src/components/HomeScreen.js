import React from "react";
import DisplayPane from "./DisplayPane";

export default function HomeScreen(props) {
  return (
    <div id="homescreen">
      <DisplayPane
        selectedState={props.selectedState}
        updateSelectedState={props.updateSelectedState}
        selectedClusterID={props.selectedClusterID}
        updateSelectedClusterID={props.updateSelectedClusterID}
        selectedEnsembleID={props.selectedEnsembleID}
        updateSelectedEnsembleID={props.updateSelectedEnsembleID}
        />
    </div>
  );
}
