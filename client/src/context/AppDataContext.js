import { createContext, useEffect, useReducer } from 'react';
import serverAPI from '../serverAPI';

export const AppDataContext = createContext(null);
export const AppDataDispatch = createContext(null);

export function AppDataProvider({ children }) {
  const [appData, dispatch] = useReducer(appDataReducer, initialAppData);

  // Load state and ensemble summary data
  const initializeData = async () => {
    let stateListResponse = await serverAPI.getStateNames();
    let stateData = new Map();
    let ensembleSummaryData = new Map();
    if (stateListResponse) {
      for (const s of Object.values(stateListResponse.data)) {
        // Retrieve data for state
        let stateDataResponse = await serverAPI.getStateByInitials(s);
        if (stateDataResponse) {
          stateData.set(s, stateDataResponse.data);
        }
        // Delete this later
        // Retrieve summary data for ensembles in state
        let ensembleDataResponse = await serverAPI.getEnsemblesByStateInitials(s);
        if (ensembleDataResponse) {
          ensembleSummaryData.set(s, ensembleDataResponse.data);
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
    let ensembleDataResponse = await serverAPI.getEnsemblesByStateInitials(stateInitials);
    if (ensembleDataResponse) {
      dispatch({
        type: AppDataActionType.SET_ENSEMBLES_FOR_STATE,
        payload: ensembleDataResponse.data
      });
    } else {
      dispatch({
        type: AppDataActionType.SET_ENSEMBLES_FOR_STATE,
        payload: null
      });
    }
  }

  const getClustersForEnsemble = async (ensembleId) => {
    let clusterDataResponse = await serverAPI.getClustersByEnsembleId(ensembleId);
    if (clusterDataResponse) {
      dispatch({
        type: AppDataActionType.SET_CLUSTERS_FOR_ENSEMBLE,
        payload: clusterDataResponse.data
      });
    } else {
      dispatch({
        type: AppDataActionType.SET_CLUSTERS_FOR_ENSEMBLE,
        payload: null
      });
    }
  }

  const getDistrictPlansForCluster = async (clusterId) => {
    let districtPlanDataResponse = await serverAPI.getDistrictsByClusterId(clusterId);
    if (districtPlanDataResponse) {
      dispatch({
        type: AppDataActionType.SET_DISTRICT_PLANS_FOR_CLUSTER,
        payload: districtPlanDataResponse.data
      });
    } else {
      dispatch({
        type: AppDataActionType.SET_DISTRICT_PLANS_FOR_CLUSTER,
        payload: null
      });
    }
  }

  // Retrieve state-level data upon application start
  useEffect(() => {
    initializeData();
  }, []);

  // Provide API to allow data to be requested
  const dataAPI = {
    getEnsemblesForState: getEnsemblesForState,
    getClustersForEnsemble: getClustersForEnsemble,
    appDataDispatch: appDataReducer,
    getDistrictPlansForCluster: getDistrictPlansForCluster
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
  SET_ENSEMBLES_FOR_STATE: "SET_ENSEMBLES_FOR_STATE",
  SET_CLUSTERS_FOR_ENSEMBLE: "SET_CLUSTERS_FOR_ENSEMBLE",
  SET_DISTRICT_PLANS_FOR_CLUSTER: "SET_DISTRICT_PLANS_FOR_CLUSTER",
  RESET: "RESET"
}

const initialAppData = {
  stateData: new Map(),
  ensembleSummaryData: new Map(),
  selectedStateEnsembles: null,
  selectedEnsembleClusters: null,
  selectedClusterDistrictPlans: null
}

function appDataReducer(appData, action) {
  switch(action.type) {
    case AppDataActionType.INIT: {
      return {
        ...appData,
        stateData: action.payload.stateData,
        ensembleSummaryData: action.payload.ensembleSummaryData
      }
    }
    case AppDataActionType.SET_ENSEMBLES_FOR_STATE: {
      return {
        ...appData,
        selectedStateEnsembles: action.payload,
        selectedEnsembleClusters: null,
        selectedClusterDistrictPlans: null
      }
    }
    case AppDataActionType.SET_CLUSTERS_FOR_ENSEMBLE: {
      return {
        ...appData,
        selectedEnsembleClusters: action.payload
      }
    }
    case AppDataActionType.SET_DISTRICT_PLANS_FOR_CLUSTER: {
      return {
        ...appData,
        selectedClusterDistrictPlans: action.payload
      }
    }
    case AppDataActionType.RESET: {
      return {
        ...appData,
        selectedStateEnsembles: null,
        selectedEnsembleClusters: null,
        selectedClusterDistrictPlans: null
      }
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}