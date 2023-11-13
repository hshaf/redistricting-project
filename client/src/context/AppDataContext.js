import { createContext, useEffect, useReducer } from 'react';
import serverAPI from '../serverAPI';

export const AppDataContext = createContext(null);
export const AppDataDispatch = createContext(null);

export function AppDataProvider({ children }) {
  const [appData, dispatch] = useReducer(appDataReducer, initialAppData);

  // Load state and ensemble summary data on startup
  async function initializeData() {
    let stateListResponse = await serverAPI.getStateNames();
    let stateData = new Map();
    let ensembleSummaryData = new Map();
    if (stateListResponse.status === 200) {
      for (const s of Object.values(stateListResponse.data)) {
        // Retrieve data for state
        let stateDataResponse = await serverAPI.getStateByInitials(s);
        if (stateDataResponse.status === 200) {
          stateData.set(s, stateDataResponse.data);
        }
        else {
          console.log("Error in retrieving stateDataResponse");
          console.log(stateDataResponse);
        }
        // Retrieve summary data for ensembles in state
        let ensembleDataResponse = await serverAPI.getEnsemblesByStateInitials(s);
        if (ensembleDataResponse.status === 200) {
          ensembleSummaryData.set(s, ensembleDataResponse.data);
        }
        else {
          console.log("Error in retrieving ensembleDataResponse");
          console.log(ensembleDataResponse);
        }
      }
    }
    else {
      console.log("Error in retrieving stateListResponse");
      console.log(stateListResponse);
    }
    dispatch({
      type: AppDataActionType.INIT,
      payload: {
        stateData: stateData,
        ensembleSummaryData: ensembleSummaryData
      }
    });
    console.log(stateData); // Remove this when debugging is done
  }

  useEffect(() => {
    initializeData();
  }, []);

  return (
    <AppDataContext.Provider value={appData}>
      <AppDataDispatch.Provider value={dispatch}>
        {children}
      </AppDataDispatch.Provider>
    </AppDataContext.Provider>
  );
}

export const AppDataActionType = {
  INIT: "INIT"
}

const initialAppData = {
  stateData: new Map(),
  ensembleSummaryData: new Map(),
  selectedEnsemble: null
}

function appDataReducer(appData, action) {
  switch(action.type) {
    case AppDataActionType.INIT: {
      return {
        ...appData,
        stateData: action.payload.stateData,
        ensembleSummaryData: action.payload.ensembleSummaryData,
        selectedEnsemble: null
      }
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}