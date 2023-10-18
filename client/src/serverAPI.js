import axios from 'axios';

//axios.defaults.withCredentials = true;

const api = axios.create(
  {
    baseURL: "http://localhost:8080"
  }
)

//State Endpoints
export const getStateByName = (name) => api.get(`/state/${name}`)

//Ensemble Endpoints
export const getEnsembleById = (id) => api.get(`/ensemble/${id}`)

//Cluster Endpoints
export const getClusterById = (id) => api.get(`/cluster/${id}`)

export const updateClusterById = (cluster, id) => {
  return api.put(`/cluster/update/${id}`, {cluster:cluster})
  }

//District Endpoints
export const getDistrictById = (id) => api.get(`/district/${id}`)

//Boundary Endpoints
export const getBoundaryById = (id) => api.get(`/boundary/${id}`)

export const getBoundaryByDistrictId = (districtId) => api.get(`/boundary/district/${districtId}`)

//Test Endpoints
export const getHello = () => api.get(`/test/`)
export const getList = () => api.get(`/test/list`)
export const getHash = () => api.get(`test/hash`)
export const getHelloName = (name) => api.get(`/test/${name}`)


const apis = {
  getStateByName,
  getEnsembleById,
  getClusterById,
  updateClusterById,
  getDistrictById,
  getBoundaryById,
  getBoundaryByDistrictId,
  getHello,
  getList,
  getHash,
  getHelloName
}

export default apis