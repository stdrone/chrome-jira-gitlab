<template>
  <div>
    <vk-table
      :data="config.projects"
      :selected-rows.sync="selected"
      rows-selectable
    >
      <vk-table-column-select></vk-table-column-select>
      <vk-table-column title="Project name" cell="name"></vk-table-column>
    </vk-table>
    <div class="buttons">
      <vk-button type="primary" :disabled="!selected.length">
        Create branches {{ selected.length }}
      </vk-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "BranchConfig",
  props: {
    config: Object,
  },
  data() {
    return {
      selected: [],
    };
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
