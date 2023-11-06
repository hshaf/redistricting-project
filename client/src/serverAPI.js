import axios from 'axios';

//axios.defaults.withCredentials = true;

const api = axios.create(
  {
    baseURL: "http://localhost:8080"
  }
)

//State Endpoints
export const getStateByInitials = (initials) => api.get(`/state/${initials}`)

export const getStateNames = () => api.get(`/state/getNames`)

//Ensemble Endpoints
export const getEnsembleById = (id) => api.get(`/ensemble/${id}`)

export const getAllEnsembles = () => api.get(`/ensemble/getAll`)

export const getEnsemblesByStateInitials = (initials) => api.get(`/ensemble/state/${initials}`)

//Cluster Endpoints
export const getClusterById = (id) => api.get(`/cluster/${id}`)

export const getClustersByEnsembleId = (id) => api.get(`/cluster/ensemble/${id}`)

export const updateClusterById = (cluster, id) => {
  return api.put(`/cluster/update/${id}`, {cluster:cluster})
  }

//District Endpoints
export const getDistrictById = (id) => api.get(`/district/${id}`)

export const getDistrictsByClusterId = (id) => api.get(`/district/cluster/${id}`)

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

export default apis