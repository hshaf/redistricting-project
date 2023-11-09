import { createContext, useEffect, useReducer } from 'react';
import serverAPI from '../serverAPI';

export const AppDataContext = createContext(null);
export const AppDataDispatch = createContext(null);

export function AppDataProvider({ children }) {
  const [appData, dispatch] = useReducer(appDataReducer, initialDataState);

  // Load state and ensemble summary data on startup
  async function initializeData() {
    let stateListResponse = await serverAPI.getStateNames();
    let stateData = new Map();
    if (stateListResponse.status === 200) {
      for (const s of Object.values(stateListResponse.data)) {
        let stateDataResponse = await serverAPI.getStateByInitials(s);
        if (stateDataResponse.status === 200) {
          stateData.set(s, stateDataResponse.data);
        }
        else {
          console.log("Error in retrieving stateDataResponse");
          console.log(stateDataResponse);
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
        ensembleSummaryData: null
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
  )
}

export const AppDataActionType = {
  INIT: "INIT"
}

const initialDataState = {
  stateData: new Map(),
  ensembleSummaryData: null,
  ensembleObj: null
}

function appDataReducer(appData, action) {
  switch(action.type) {
    case AppDataActionType.INIT: {
      return {
        stateData: action.payload.stateData,
        ensembleSummaryData: action.payload.ensembleSummaryData,
        ensembleObj: null
      }
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}