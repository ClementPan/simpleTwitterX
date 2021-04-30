import axios from 'axios'
import Swal from 'sweetalert2'

const baseURL = 'https://simple-twitter-api-2021.herokuapp.com/api'

const axiosInstance = axios.create({
  baseURL
})

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
    // CORS
    // config.headers['Access-Control-Allow-Origin'] = '*';
    // config.headers['Access-Control-Allow-Credentials'] = 'true';
    // config.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS';
    // config.headers['Access-Control-Allow-Headers'] = 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json';
    // config.headers['credentials'] = 'include'
  }
  return config
}, err => {
  Promise.reject(err)
})

export const apiHelper = axiosInstance

export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 5000
})