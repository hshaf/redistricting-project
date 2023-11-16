import axios from 'axios';

//axios.defaults.withCredentials = true;

const api = axios.create(
  {
    baseURL: "http://localhost:8080"
  }
)

//State Endpoints
export const getStateByInitials = (initials) => api.get(`/state/${initials}`)
                                                .catch((error) => {
                                                  printErrorMsg(error);
                                                  return null;
                                                })

export const getStateNames = () => api.get(`/state/getNames`)
                                    .catch((error) => {
                                      printErrorMsg(error);
                                      return null;
                                    })

//Ensemble Endpoints
export const getEnsembleById = (id) => api.get(`/ensemble/${id}`)

export const getAllEnsembles = () => api.get(`/ensemble/getAll`)

export const getEnsemblesByStateInitials = (initials) => api.get(`/ensemble/state/${initials}`)
                                                          .catch((error) => {
                                                            printErrorMsg(error);
                                                            return null;
                                                          })

//Cluster Endpoints
export const getClusterById = (id) => api.get(`/cluster/${id}`)

export const getClustersByEnsembleId = (id) => api.get(`/cluster/ensemble/${id}`)
                                                .catch((error) => {
                                                  printErrorMsg(error);
                                                  return null;
                                                })

export const updateClusterById = (cluster, id) => {
  return api.put(`/cluster/update/${id}`, {cluster:cluster})
  }

//District Endpoints
export const getDistrictById = (id) => api.get(`/district/${id}`)

export const getDistrictsByClusterId = (id) => api.get(`/district/cluster/${id}`)
                                                .catch((error) => {
                                                  printErrorMsg(error);
                                                  return null;
                                                })

//Boundary Endpoints
export const getBoundaryById = (id) => api.get(`/boundary/${id}`)

export const getBoundaryByDistrictId = (districtId) => api.get(`/boundary/district/${districtId}`)

//Test Endpoints
export const getHello = () => api.get(`/test/`)
export const getList = () => api.get(`/test/list`)
export const getHash = () => api.get(`test/hash`)
export const getHelloName = (name) => api.get(`/test/${name}`)


const apis = {
  getStateByInitials,
  getStateNames,
  getEnsembleById,
  getAllEnsembles,
  getEnsemblesByStateInitials,
  getClusterById,
  getClustersByEnsembleId,
  updateClusterById,
  getDistrictById,
  getDistrictsByClusterId,
  getBoundaryById,
  getBoundaryByDistrictId,
  getHello,
  getList,
  getHash,
  getHelloName
}

function printErrorMsg(error) {
  /* Credit to axios documentation for this code snippet 
  (https://axios-http.com/docs/handling_errors) */

  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
  console.log(error.config);
}

export default apis