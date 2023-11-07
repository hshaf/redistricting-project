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
function appStateReducer(appState, action) {
    switch(action.type) {
        case "setSelectedState": {
            return {
                ...appState,
                selectedState: action.payload,
                selectedEnsembleID: "1",
                selectedClusterID: "",
                selectedDistrictPlanID: ""
            }
        }
        case "setEnsemble": {
            return {
                ...appState,
                selectedEnsembleID: action.payload,
                selectedClusterID: "",
                selectedDistrictPlanID: ""
            }
        }
        case "setSelectedCluster": {
            return {
                ...appState,
                selectedClusterID: action.payload,
                selectedDistrictPlanID: ""
            }
        }
        case "setSelectedDistrictPlan": {
            return {
                ...appState,
                selectedDistrictPlanID: action.payload
            }
        }
        default: {
            throw Error("Unknown action: " + action.typ);
        }
    }
}

const initialAppState = {
    selectedState: "",
    selectedEnsembleID: "1",
    selectedClusterID: "",
    selectedDistrictPlanID: ""
}