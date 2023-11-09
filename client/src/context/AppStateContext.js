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
    // String tracking currently selected state ("VA", "AZ", or "WI")
    // If no state is selected, then value is ""
    selectedState: "",
    // Track ID of currently selected ensemble.
    // By default this value is "1" (first ensemble).
    // User can select an ID greater than "1" to view different ensemble.
    selectedEnsembleID: "1",
    // Track ID of currently selected cluster.
    // If no state or cluster is chosen, then value is ""
    selectedClusterID: "",
    // Track ID of currently selected district plan.
    // If no district plan is chosen, then value is ""
    selectedDistrictPlanID: ""
}

/*
Actions take on the following format:
{
    type: describes the action,
    payload: provides the parameter(s) for the action
}
*/
export const AppStateActionType = {
    SET_SELECTED_STATE: "SET_SELECTED_STATE",
    SET_SELECTED_ENSEMBLE: "SET_SELECTED_ENSEMBLE",
    SET_SELECTED_CLUSTER: "SET_SELECTED_CLUSTER",
    SET_SELECTED_DISTRICT_PLAN: "SET_SELECTED_DISTRICT_PLAN"
}
function appStateReducer(appState, action) {
    switch(action.type) {
        /** 
         * Update the current selected state. Selected state will update if
         * user clicks button on "select state" dropdown, or clicks on a state
         * boundary.
         * 
         * @param {String}  payload     Abbreviated name of selected state.
         */
        case AppStateActionType.SET_SELECTED_STATE: {
            return {
                ...appState,
                selectedState: action.payload,
                selectedEnsembleID: "1",
                selectedClusterID: "",
                selectedDistrictPlanID: ""
            }
        }
        /** 
         * Update the current selected ensemble ID.
         * 
         * @param {String}  payload     ID of selected ensemble.
         */
        case AppStateActionType.SET_SELECTED_ENSEMBLE: {
            return {
                ...appState,
                selectedEnsembleID: action.payload,
                selectedClusterID: "",
                selectedDistrictPlanID: ""
            }
        }
        /** 
         * Update the current selected cluster ID.
         * 
         * @param {String}  payload     ID of selected cluster.
         */
        case AppStateActionType.SET_SELECTED_CLUSTER: {
            return {
                ...appState,
                selectedClusterID: action.payload,
                selectedDistrictPlanID: ""
            }
        }
        /** 
         * Update the current selected district plan ID.
         * 
         * @param {String}  payload     ID of selected district plan.
         */
        case AppStateActionType.SET_SELECTED_DISTRICT_PLAN: {
            return {
                ...appState,
                selectedDistrictPlanID: action.payload
            }
        }
        default: {
            throw Error("Unknown action: " + action.type);
        }
    }
}