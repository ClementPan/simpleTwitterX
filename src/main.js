import Vue from 'vue'
import App from './App.vue'
import router from './router'
// global css
import './assets/css/application.css'
// reset.css
import './assets/css/reset.css'
// import fontawesome
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
// import store
import store from './store'
// import eventbus
import './utils/bus'
// vue-socket.io
import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'https://simple-twitter-api-2021.herokuapp.com/',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
    options: { path: '/' }
  }
}))

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'https://simple-twitter-api-2021.herokuapp.com/',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
    options: { path: '/' }
  }
}))

// const options = { path: './App' };
// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: SocketIO('https://simple-twitter-api-2021.herokuapp.com',options), //options object is Optional
//   vuex: {
//     store,
//     actionPrefix: "SOCKET_",
//     mutationPrefix: "SOCKET_"
//   }
// })
// );

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
