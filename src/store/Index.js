// store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    authToken: null,
    refreshToken: null,
  },
  mutations: {
    setAuth(state, token) {
      state.authToken = token;
    },
    setRefresh(state, token) {
      state.refreshToken = token;
    },
  },
  actions: {},
  getters: {
    isLoggedIn(state) {
      return !!state.token;
    },
  },
});
