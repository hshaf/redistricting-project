import { useState } from "react";
import './App.css';
import HomeScreen from './components/HomeScreen';

export default function App() {
  const [state, setState] = useState({
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
  })

  let updateSelectedState = (stateName) => {
    /** 
     * Update the current selected state. Selected state will update if
     * user clicks button on "select state" dropdown, or clicks on a state
     * boundary.
     * 
     * @param {String}  stateName   Abbreviated name of selected state.
     */

    console.log('in updateSelectedState()');

    if (stateName === state.selectedState) return;

    setState({
      ...state,
      selectedState: stateName,
      selectedEnsembleID: "1",
      selectedClusterID: ""
    });
  }

  let updateSelectedClusterID = (clusterID) => {
    /** 
     * Update the current selected cluster ID.
     * 
     * @param {String}  clusterID   ID of selected cluster.
     */

    setState({
      ...state,
      selectedClusterID: clusterID
    });
  }

  let updateSelectedEnsembleID = (ensembleID) => {
    /** 
     * Update the current selected ensemble ID.
     * 
     * @param {String}  ensembleID   ID of selected ensemble.
     */
    setState({
      ...state,
      selectedClusterID: "",
      selectedEnsembleID: ensembleID
    });
  }

  // Render App
  return (
    <HomeScreen 
      selectedState={state.selectedState}
      updateSelectedState={updateSelectedState}
      selectedClusterID={state.selectedClusterID}
      updateSelectedClusterID={updateSelectedClusterID}
      selectedEnsembleID={state.selectedEnsembleID}
      updateSelectedEnsembleID={updateSelectedEnsembleID}
    />
  );
}
