<template>
  <div>
    <config-table v-if="editMode === 'view'" :rows="data" @edit="onEditRow" />
    <config-edit
      v-if="editMode === 'edit'"
      :row="editRow"
      @close="onCloseEdit"
    />
  </div>
</template>

<script>
import ConfigEdit from "../components/ConfigEdit.vue";
import ConfigTable from "../components/ConfigTable.vue";

export default {
  name: "App",
  components: { ConfigTable, ConfigEdit },
  props: {
    editRow: Object,
    editMode: {
      type: String,
      default: "view",
    },
  },
  computed: {
    data() {
      return this.$store.getters.configData;
    },
  },
  methods: {
    onEditRow(row) {
      this.editRow = this.data[row];
      this.editMode = "edit";
    },
    onCloseEdit() {
      this.editMode = "view";
    },
  },
};
</script>

<style>
html {
  width: 800px;
  height: 400px;
}
</style>
