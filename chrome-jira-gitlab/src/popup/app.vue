<template>
  <div class="popup">
    <div v-if="config?.issue">
      <BranchConfig :config="config" />
    </div>
    <div
      v-else
      class="noconfig"
    >
      No config for this site
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '@/store/store'
import BranchConfig from '@/components/BranchConfig.vue'
import { AppConfig } from '@/models'

const appConfig = useAppConfig()
const config = ref<AppConfig>()

onMounted(() => {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    (tabs: chrome.tabs.Tab[]) => {
      let [tab] = tabs

      appConfig.$state.configData.forEach((x) => {
        if (tab?.url?.includes(x.jira)) {
          const cfg = Object.assign({}, x)
          let issue = new URL(tab.url).pathname.split('/')
          cfg.issue = `${issue[issue.length - 1]}`
          config.value = cfg
        }
      })
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, 'getIssueName', (issueName: string) => {
          if (config.value) config.value.issueName = issueName
        })
      }
    }
  )
})
</script>

<style>
html {
  height: 600px;
}

.noconfig {
  text-align: center;
}
</style>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
