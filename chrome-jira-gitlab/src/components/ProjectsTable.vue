<template>
  <div>
    <vk-table :data="configRow.projects" hoverable>
      <vk-table-column cell="rn" slot-scope="{ selected }">
        <vk-button type="link" @click="deleteClick(selected)"> ✗ </vk-button>
      </vk-table-column>
      <vk-table-column title="Project ID" cell="id"></vk-table-column>
      <vk-table-column title="Project name" cell="name" slot-scope="{ row }">
        <input v-model="row.name" />
      </vk-table-column>
      <vk-table-column title="Projects" cell="token"></vk-table-column>
    </vk-table>
    <div class="buttons">
      <vk-button @click="saveClick()">Save</vk-button>
      <vk-button @click="cancelClick()">Cancel</vk-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectsTable",
  props: {
    configRow: Object,
  },
  emits: ["save", "cancel"],
  methods: {
    deleteClick(selected) {
      console.log(selected);
      // this.rows.spline(selected, 1);
    },
    saveClick() {
      let data = this.$store.getters.configData;
      data[this.configRow.rn] = this.configRow;
      this.$store.commit("configData", data);
      this.$emit("close");
    },
    cancelClick() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
p {
  font-size: 20px;
}

div.buttons {
  text-align: center;
}
</style>
