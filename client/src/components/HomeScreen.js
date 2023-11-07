import React from "react";
import DisplayPane from "./DisplayPane";
import { AppStateProvider } from "../context/AppStateContext";

export default function HomeScreen(props) {
  return (
    <div id="homescreen">
      <AppStateProvider>
        <DisplayPane
          selectedState={props.selectedState}
          updateSelectedState={props.updateSelectedState}
          selectedClusterID={props.selectedClusterID}
          updateSelectedClusterID={props.updateSelectedClusterID}
          selectedEnsembleID={props.selectedEnsembleID}
          updateSelectedEnsembleID={props.updateSelectedEnsembleID}
        />
      </AppStateProvider>
    </div>
  );
}
