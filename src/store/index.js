import Vue from 'vue'
import Vuex from 'vuex'
import usersAPI from '../apis/users'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: {
      account: '',
      avatar: '',
      cover: '',
      email: "",
      id: undefined,
      introdcution: '',
      name: "",
      role: 'user',
    },
    isAuthenticated: false,
    token: ''
  },
  mutations: {
    setCurrentUser(state, currentUser) {
      state.currentUser = {
        ...state.currentUser,
        ...currentUser // 透過API取得
      }
      state.isAuthenticated = true
      state.token = localStorage.getItem('token')
    },
    revokeAuthentication(state) {
      state.currentUser = {}
      state.isAuthenticated = false
      state.token = ''
      localStorage.removeItem('token')
    }
  },
  actions: {
    async fetchCurrentUser({ commit }) {
      try {
        console.log('fetchCurrentUser')
        // 應該是使用 token 驗證才對
        const { data } = await usersAPI.getCurrentUser()

        if (data.status === 'error') {
          throw new Error(data.message)
        }

        const { account, id, name, email, avatar, role } = data

        commit('setCurrentUser', {
          account, id, name, email, avatar, role
        })

        // signin success
        return true
      } catch (error) {
        // 驗證失敗的話一併觸發登出的行為，以清除 state 中的 token
        commit('revokeAuthentication')
        console.log(error.message)
        return false
      }
    }
  },
  modules: {
  }
})