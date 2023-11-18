<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <RouterView></RouterView>
  </n-config-provider>
</template>

<script setup lang="ts">
import { GlobalThemeOverrides, NConfigProvider } from 'naive-ui'
const themeOverrides = {
  Button: {
    textColorPrimary: '#000',
  },
} as GlobalThemeOverrides
</script>

<style scoped></style>
