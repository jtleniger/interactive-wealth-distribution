import Vue from 'vue'
import Vuex from 'vuex'

import { INITIAL_PERCENTS } from '@/common.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    percents: [...INITIAL_PERCENTS],
    saved: {
      ideal: [],
      current: [],
      reality: [
        84,
        11,
        4,
        0.5,
        0.3
      ]
    }
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
