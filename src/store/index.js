import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const INITIAL_PERCENTS = [
  20,
  20,
  20,
  20,
  20
];

export default new Vuex.Store({
  state: {
    percents: [...INITIAL_PERCENTS],
    saved: {}
  },
  mutations: {
    setPercents (state, payload) {
      state.percents = payload;
    },
    savePercents (state, payload) {
      state.saved[payload] = state.percents.map(p => Math.round(p));
      state.percents = [...INITIAL_PERCENTS];
    }
  },
  actions: {
  },
  modules: {
  }
})
