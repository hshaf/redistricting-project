import axios from 'axios';

//axios.defaults.withCredentials = true;

const api = axios.create(
  {
    baseURL: "http://localhost:8080"
  }
)

export const getHello = () => api.get(`/test/`)
export const getList = () => api.get(`/test/list`)
export const getHash = () => api.get(`test/hash`)
export const getHelloName = (name) => api.get(`/test/${name}`)


const apis = {
  getHello,
  getList,
  getHash,
  getHelloName
}

export default apis