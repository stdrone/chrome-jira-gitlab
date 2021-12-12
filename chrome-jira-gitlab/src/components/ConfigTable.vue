<template>
  <vk-table :data="rows" hoverable>
    <vk-table-column cell="rn">
      <div v-if="row.jira" slot-scope="{ row }">
        <vk-button type="link" @click="editClick(row)"> &#9998; </vk-button>
        <vk-button type="link" @click="deleteClick(row)"> ✗ </vk-button>
      </div>
      <vk-button
        v-else
        type="link"
        slot-scope="{ row }"
        @click="editClick(row)"
      >
        +
      </vk-button>
    </vk-table-column>
    <vk-table-column title="Jira site" cell="jira"></vk-table-column>
    <vk-table-column title="Gitlab site" cell="gitlab"></vk-table-column>
    <vk-table-column title="Gitlab token" cell="token"></vk-table-column>
    <vk-table-column title="Projects">
      <vk-button
        slot-scope="{ row }"
        v-if="row.gitlab & row.token"
        type="link"
        @click="projectsClick(row)"
      >
        ...
      </vk-button>
    </vk-table-column>
  </vk-table>
</template>

<script>
export default {
  name: "ConfigTable",
  props: {
    rows: Array,
  },
  emits: ["edit"],
  methods: {
    editClick(row) {
      this.$emit("edit", row.rn);
    },
    deleteClick(row) {
      let data = this.$store.getters.configData;
      data.splice(row.rn, 1);
      this.$store.commit("configData", data);
    },
    projectsClick(row) {
      this.$emit("projects", row.rn);
    },
  },
};
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
