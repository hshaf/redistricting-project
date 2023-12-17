import { createContext, useReducer } from 'react';

export const AppStateContext = createContext(null);
export const AppStateDispatch = createContext(null);

export function AppStateProvider({ children }) {
  const [appState, dispatch] = useReducer(appStateReducer, initialAppState);

  return (
    <AppStateContext.Provider value={appState}>
      <AppStateDispatch.Provider value={dispatch}>
        {children}
      </AppStateDispatch.Provider>
    </AppStateContext.Provider>
  )
}

const initialAppState = {
  /* String tracking currently selected state ("VA", "AZ", or "WI").
  If no state is selected, then value is null */
  selectedState: null,
  /* Track index of currently selected ensemble.
  By default this value is null (no ensemble selected). */
  selectedEnsembleID: null,
  /* Track index of currently selected cluster.
  If no state or cluster is chosen, then value is "" */
  selectedClusterID: null,
  /* Track index of currently selected district plan.
  If no district plan is chosen, then value is "" */
  selectedDistrictPlanID: null,
  /* ID of the generated plan boundary to be displayed on the map.
  Set to null if no generated cluster or district plan boundary is selected. */
  displayedBoundary: null
}

/* Actions take on the following format:
{
  type: describes the action,
  payload: provides the parameter(s) for the action
} 
*/

export const AppStateActionType = {
  SET_SELECTED_STATE: "SET_SELECTED_STATE",
  SET_SELECTED_ENSEMBLE: "SET_SELECTED_ENSEMBLE",
  SET_SELECTED_CLUSTER: "SET_SELECTED_CLUSTER",
  SET_SELECTED_DISTRICT_PLAN: "SET_SELECTED_DISTRICT_PLAN",
  SET_DISPLAYED_BOUNDARY: "SET_DISPLAYED_BOUNDARY"
}

function appStateReducer(appState, action) {
  switch(action.type) {
    case AppStateActionType.SET_SELECTED_STATE: {
      return {
        ...appState,
        selectedState: action.payload,
        selectedEnsembleID: null,
        selectedClusterID: null,
        selectedDistrictPlanID: null,
        displayedBoundary: null
      }
    }
    case AppStateActionType.SET_SELECTED_ENSEMBLE: {
      return {
        ...appState,
        selectedEnsembleID: action.payload,
        selectedClusterID: null,
        selectedDistrictPlanID: null,
        displayedBoundary: null
      }
    }
    case AppStateActionType.SET_SELECTED_CLUSTER: {
      return {
        ...appState,
        selectedClusterID: action.payload,
        selectedDistrictPlanID: null
      }
    }
    case AppStateActionType.SET_SELECTED_DISTRICT_PLAN: {
      return {
        ...appState,
        selectedDistrictPlanID: action.payload
      }
    }
    case AppStateActionType.SET_DISPLAYED_BOUNDARY: {
      return {
        ...appState,
        displayedBoundary: action.payload
      }
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}