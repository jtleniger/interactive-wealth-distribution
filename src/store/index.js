import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    percents: [
      20,
      20,
      20,
      20,
      20
    ]
  },
  mutations: {
    setPercents (state, payload) {
      state.percents = payload;
    }
  },
  actions: {
  },
  modules: {
  }
})
