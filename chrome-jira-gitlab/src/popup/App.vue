<template>
  <div class="popup">
    <div v-if="config">
      <BranchConfig :config="config" />
    </div>
    <div class="noconfig" v-else>No config for this site</div>
  </div>
</template>

<script>
import BranchConfig from "../components/BranchConfig.vue";

export default {
  name: "App",
  components: { BranchConfig },
  data() {
    return {
      config: { projects: [] },
    };
  },
  mounted() {
    var query = { active: true, currentWindow: true };
    const me = this;
    chrome.tabs.query(query, (tabs) => {
      let url = tabs[0].url;
      let config = { projects: [] };
      me.$store.getters.configData.forEach((element) => {
        if (url.includes(element.jira)) {
          let issue = new URL(url).pathname.split("/");
          element.issue = `/${issue[issue.length - 1]}`;
          config = element;
        }
      });
      me.config = config;
    });
  },
};
</script>

<style>
html {
  width: 400px;
  height: 400px;
}

.noconfig {
  text-align: center;
}
</style>
