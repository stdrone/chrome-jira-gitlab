<template>
  <div>
    <q-table title="Config" :rows="rows" :columns="columns" />
  </div>
</template>

<script>
const columns = [
  {
    name: "jira",
    required: true,
    label: "Jira host",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "gitlab",
    required: true,
    label: "Gitlab host",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "gitlabkey",
    required: true,
    label: "Gitlab key",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
];
const rows = [{ jira: "test", gitlab: "test", gitlabkey: "test" }];

export default {
  name: "ConfigTable",
  setup() {
    return {
      columns,
      rows,
    };
  },
};
</script>

<style scoped>
p {
  font-size: 20px;
}
</style>
