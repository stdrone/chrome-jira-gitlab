<template>
  <config-table />
</template>

<script>
import ConfigTable from '../components/ConfigTable.vue';

export default {
  name: "App",
  components: { ConfigTable },
};
</script>

<style>
html {
  width: 400px;
  height: 400px;
}
</style>
