<template>
  <div>
    <div class="text-center m-4">
      <h1 class="text-2xl font-bold underline pb-6">Jira-Gitlab site config</h1>
    </div>
    <div>
      <div>
        <n-form
          v-if="edit"
          label-placement="left"
          label-width="150px"
        >
          <n-form-item label="Project ID">
            <n-input-number
              v-model:value="edit.id"
              :show-button="false"
              :keyboard="{ ArrowDown: false, ArrowUp: false }"
            />
          </n-form-item>
          <n-form-item label="Project name">
            <n-input v-model:value="edit.name" />
          </n-form-item>
        </n-form>
      </div>
    </div>
    <div class="text-center m-4">
      <n-button
        type="primary"
        @click="save"
      >
        Save
      </n-button>
      <n-button @click="back">Back</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppConfig } from '@/store/store'
import { NButton, NForm, NFormItem, NInput, NInputNumber } from 'naive-ui'
import { Project } from '@/models'

const router = useRouter()
const route = useRoute()

const appConfig = useAppConfig()

const edit = ref<Project>(
  appConfig.configData[Number.parseInt(route.params.index as string)].projects[
    Number.parseInt(route.params.project as string)
  ]
)

const save = () => {
  const config = appConfig.configData ?? []
  const index = Number.parseInt(route.params.index as string)
  const project = Number.parseInt(route.params.project as string)
  if (config[index] && edit.value) {
    config[index].projects[project] = edit.value
    appConfig.save(config)
    router.push(`/edit/${index}`)
  }
}

const back = () => {
  const index = Number.parseInt(route.params.index as string)
  router.push(`/edit/${index}`)
}
</script>

<style scoped></style>
