import Vue from "vue";
import App from "./App.vue";
import Store from "../store/index.js";

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store: Store,
  render: (h) => h(App),
});
