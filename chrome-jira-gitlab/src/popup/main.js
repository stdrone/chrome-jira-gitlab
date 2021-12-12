import Vue from "vue";
import App from "./App.vue";
import Store from "../store/index.js";
import Vuikit from "vuikit";
import VuikitIcons from "@vuikit/icons";

import "@vuikit/theme";

Vue.use(Vuikit);
Vue.use(VuikitIcons);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store: Store,
  render: (h) => h(App),
});
