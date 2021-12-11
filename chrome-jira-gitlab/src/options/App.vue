<template>
  <div>
    <config-table
      v-if="!editMode"
      :rows="data"
      @edit="onEditRow"
      @delete="onDeleteRow"
    />
    <config-edit
      v-else
      :row="editRow"
      @cancel="onCancel()"
      @save="onSave($event)"
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
    editMode: Boolean,
  },
  setup() {
    this.editRow = {};
    this.editMode = false;
  },
  computed: {
    data() {
      const data = this.$store.getters.configData;
      return data.map((x, idx) => {
        x.rn = idx;
        return x;
      });
    },
  },
  methods: {
    onEditRow(row) {
      this.editRow = this.data[row];
      this.editMode = true;
    },
    onDeleteRow(row) {
      let data = this.$store.getters.configData;
      data.splice(row, 1);
      this.$store.commit("configData", data);
    },
    onCancel() {
      this.editMode = false;
    },
    onSave(value) {
      if (value) {
        let data = this.$store.getters.configData;
        if (!value.rn) {
          value.rn = data.length - 1;
          data.push({});
        }
        data[value.rn] = value;
        this.$store.commit("configData", data);
      }
      this.editMode = false;
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
