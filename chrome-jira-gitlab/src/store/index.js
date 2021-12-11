import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    configData: JSON.parse(window.localStorage.getItem("configData") || "[{}]"),
  },
  getters: {
    configData: (state) => {
      return state.configData;
    },
  },
  mutations: {
    configData: (state, value) => {
      state.configData = value;
      window.localStorage.setItem("configData", JSON.stringify(value));
    },
  },
  actions: {},
  modules: {},
});
