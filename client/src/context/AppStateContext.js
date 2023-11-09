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
        case AppStateActionType.SET_SELECTED_STATE: {
            return {
                ...appState,
                selectedState: action.payload,
                selectedEnsembleID: "1",
                selectedClusterID: "",
                selectedDistrictPlanID: ""
            }
        }
        case AppStateActionType.SET_SELECTED_ENSEMBLE: {
            return {
                ...appState,
                selectedEnsembleID: action.payload,
                selectedClusterID: "",
                selectedDistrictPlanID: ""
            }
        }
        case AppStateActionType.SET_SELECTED_CLUSTER: {
            return {
                ...appState,
                selectedClusterID: action.payload,
                selectedDistrictPlanID: ""
            }
        }
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

const initialAppState = {
    selectedState: "",
    selectedEnsembleID: "1",
    selectedClusterID: "",
    selectedDistrictPlanID: ""
}