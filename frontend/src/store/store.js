import Vuex from 'vuex'

import { taskStore } from './task.store.js'

export const store = Vuex.createStore({
  strict: true,
  modules: {
    taskStore,
  },
  state: {},
  mutations: {},
  actions: {},
})
