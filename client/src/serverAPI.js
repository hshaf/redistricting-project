import axios from 'axios';

//axios.defaults.withCredentials = true;

const api = axios.create(
  {
    baseURL: "http://localhost:8080"
  }
)

export const getHello = () => api.get('/test/')


const apis = {
  getHello
}

export default apis