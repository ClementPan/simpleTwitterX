import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/application.css'
import './assets/css/reset.css'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import store from './store'
import './utils/bus'
import VueSocketIO from 'vue-socket.io'
import SocketIO from "socket.io-client";

const baseURL = 'https://simple-twitter-api-2021.herokuapp.com/'
const token = localStorage.getItem('token')

const connection = new SocketIO(baseURL, {
  reconnectionDelayMax: 10000,
  auth: {
    token: token
  }
})

Vue.use(new VueSocketIO({
  debug: true,
  connection,
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  },
}))

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
