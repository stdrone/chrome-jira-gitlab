<template>
  <div>
    <config-table
      v-if="editMode === 'view'"
      :rows="data"
      @edit="onEditRow"
      @projects="onProjectsRow"
    />
    <config-edit
      v-if="editMode === 'edit'"
      :row="editRow"
      @close="onCloseEdit"
    />
    <projects-table
      v-if="editMode === 'projects'"
      :configRow="editRow"
      @close="onCloseEdit"
    />
  </div>
</template>

<script>
import ConfigEdit from "../components/ConfigEdit.vue";
import ConfigTable from "../components/ConfigTable.vue";
import ProjectsTable from "../components/ProjectsTable.vue";

export default {
  name: "App",
  components: { ConfigTable, ConfigEdit, ProjectsTable },
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
    onProjectsRow(row) {
      this.editRow = this.data[row];
      this.editMode = "projects";
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
