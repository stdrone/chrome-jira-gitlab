<template>
  <div>
    <form>
      <label class="uk-legend">Jira site</label>
      <input class="uk-input" v-model="row.jira" />
      <label class="uk-legend">Gitlab site</label>
      <input class="uk-input" v-model="row.gitlab" />
      <label class="uk-legend">Gitlab token</label>
      <input class="uk-input" v-model="row.token" />
      <div>
        <vk-button @click="saveClick(null)">Save</vk-button>
        <vk-button @click="cancelClick()">Cancel</vk-button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "ConfigEdit",
  emits: ["save", "cancel"],
  props: {
    row: Object,
  },
  methods: {
    saveClick() {
      this.$emit("save", this.row);
    },
    cancelClick() {
      this.$emit("save", null);
    },
  },
};
</script>

<style scoped>
p {
  font-size: 20px;
}

form div {
  text-align: center;
}
</style>
