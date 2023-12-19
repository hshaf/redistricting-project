import { createContext, useEffect, useReducer } from 'react';
import serverAPI from '../serverAPI';

export const AppDataContext = createContext(null);
export const AppDataDispatch = createContext(null);

export function AppDataProvider({ children }) {
  const [appData, dispatch] = useReducer(appDataReducer, initialAppData);

  /**
   * Initialize AppDataContext with data needed during the start of the app.
   */
  const initializeData = async () => {
    // Load state data
    const stateListResponse = await serverAPI.getStateNames();
    const stateData = new Map();
    const stateBoundaries = new Map();
    const currDistrictPlans = new Map();
    if (stateListResponse) {
      for (const s of Object.values(stateListResponse.data)) {
        // Retrieve data for state
        const stateDataResponse = await serverAPI.getStateByInitials(s);
        const stateObj = stateDataResponse.data;
        if (stateDataResponse) {
          stateData.set(s, stateObj);
        }
        // Retrieve state boundary and current district plan map
        const stateBoundaryResponse = await serverAPI.getBoundaryById(stateObj["stateBoundary"]);
        if (stateBoundaryResponse) {
          stateBoundaries.set(s, stateBoundaryResponse.data.data);
        }
        const currDistrictPlanResponse = await serverAPI.getBoundaryById(stateObj["currDistrictPlanBoundary"]);
        if (currDistrictPlanResponse) {
          currDistrictPlans.set(s, currDistrictPlanResponse.data.data);
        }
      }
    }

    // Sort stateData map by name of each state ('A' -> 'Z')
    const sortedStateData = new Map([...stateData.entries()].sort((a, b) => a[1].name.localeCompare(b[1].name)));

    dispatch({
      type: AppDataActionType.INIT,
      payload: {
        "stateData": sortedStateData,
        "stateBoundaries": stateBoundaries,
        "currDistrictPlans": currDistrictPlans,
      }
    });
  }

  /**
   * Update AppDataContext with a list of ensembles from the selected state.
   * 
   * @param {String} stateInitials  Abbreviated state name.
   */
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

  /**
   * Update AppDataContext with a list of clusters from the selected ensemble.
   * 
   * @param {String} ensembleId  Ensemble ID.
   */
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

  /**
   * Update AppDataContext with a list of district plans from the selected cluster.
   * 
   * @param {String} clusterId  Cluster ID.
   */
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
    appDataDispatch: dispatch,
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
  /* Map containing state objects.
  Key is the abbreviated state name, value is the corresponding state object */
  stateData: new Map(),
  /* Map containing state boundary GeoJSONs (stored as strings).
  Key is the abbreviated state name, value is the corresponding boundary GeoJSON */
  stateBoundaries: new Map(),
  /* Map containing state current district plan map GeoJSONs (stored as strings).
  Key is the abbreviated state name, value is the corresponding boundary GeoJSON */
  currDistrictPlans: new Map(),
  /* Array of all the ensemble objects within the selected state.
  Value can be null if no state is selected. */
  selectedStateEnsembles: null,
  /* Array of all the cluster objects within the selected ensemble.
  Value can be null if no ensemble is selected. */
  selectedEnsembleClusters: null,
  /* Array of all the district plan objects within the selected cluster.
  Value can be null if no cluster is selected. */
  selectedClusterDistrictPlans: null
}

function appDataReducer(appData, action) {
  switch(action.type) {
    case AppDataActionType.INIT: {
      return {
        ...appData,
        stateData: action.payload.stateData,
        stateBoundaries: action.payload.stateBoundaries,
        currDistrictPlans: action.payload.currDistrictPlans,
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
        selectedEnsembleClusters: action.payload,
        selectedClusterDistrictPlans: null
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