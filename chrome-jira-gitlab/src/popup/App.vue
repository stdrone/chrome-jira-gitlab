<template>
  <div class="popup">
    <div v-if="url">
      {{ url }}
    </div>
    <div class="noconfig" v-else>No config for this site</div>
  </div>
</template>

<script>
export default {
  name: "App",
  props: {
    url: String,
    config: Object,
  },
  mounted() {
    var query = { active: true, currentWindow: true };
    const me = this;
    chrome.tabs.query(query, (tabs) => {
      let url = tabs[0].url;
      me.$store.getters.configData.forEach((element) => {
        if (url.includes(element.jira)) {
          me.url = url;
          me.config = element;
        }
      });
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
