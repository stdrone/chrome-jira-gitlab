import Vue from "vue";
import App from "./App.vue";
import Store from "../store/index.js";
import vSelect from "vue-select";
import Vuikit from "vuikit";
import VuikitIcons from "@vuikit/icons";
import GitLabAPI from "vue-gitlab-api";
import VueResource from "vue-resource";

import "@vuikit/theme";
import "vue-select/dist/vue-select.css";

Vue.use(Vuikit);
Vue.use(VuikitIcons);
Vue.use(VueResource);
Vue.use(GitLabAPI);

Vue.component("v-select", vSelect);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store: Store,
  render: (h) => h(App),
});
