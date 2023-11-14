import { createContext, useEffect, useReducer } from 'react';
import serverAPI from '../serverAPI';

export const AppDataContext = createContext(null);
export const AppDataDispatch = createContext(null);

export function AppDataProvider({ children }) {
  const [appData, dispatch] = useReducer(appDataReducer, initialAppData);

  // Load state and ensemble summary data
  const initializeData = async () => {
    let stateListResponse = await serverAPI.getStateNames()
                                            .catch((err) => { 
                                              console.log("Error in getStateNames:", err);
                                              return null;
                                            });
    let stateData = new Map();
    let ensembleSummaryData = new Map();
    if (stateListResponse) {
      for (const s of Object.values(stateListResponse.data)) {
        // Retrieve data for state
        let stateDataResponse = await serverAPI.getStateByInitials(s)
                                                .catch((err) => { 
                                                  console.log("Error in getStateByInitials:", err);
                                                  return null;
                                                });
        if (stateDataResponse) {
          stateData.set(s, stateDataResponse.data);
        }
        // Delete this later
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
    dispatch({
      type: AppDataActionType.INIT,
      payload: {
        stateData: stateData,
        ensembleSummaryData: ensembleSummaryData
      }
    });
    console.log(stateData); // Remove this when debugging is done
  }

  const getEnsemblesForState = async (stateInitials) => {
    let ensembleDataResponse = await serverAPI.getEnsemblesByStateInitials(stateInitials)
                                              .catch((err) => { 
                                                console.log("Error in getEnsemblesByStateInitials:", err);
                                                return null;
                                              });
    if (ensembleDataResponse) {
      dispatch({
        type: AppDataActionType.TEST,
        payload: ensembleDataResponse.data
      });
    }
  }

  // Retrieve state-level data upon application start
  useEffect(() => {
    initializeData();
  }, []);

  // Provide API to allow data to be requested
  const dataAPI = {
    getEnsemblesForState: getEnsemblesForState
  }

  return (
    <AppDataContext.Provider value={appData}>
      <AppDataDispatch.Provider value={dataAPI}>
        {children}
      </AppDataDispatch.Provider>
    </AppDataContext.Provider>
  );
}

export const AppDataActionType = {
  INIT: "INIT",
  TEST: "TEST"
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
    case AppDataActionType.TEST: {
      return {
        ...appData,
        selectedEnsemble: action.payload
      }
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}