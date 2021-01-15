import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    percents: [
      0.2,
      0.2,
      0.2,
      0.2,
      0.2
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
