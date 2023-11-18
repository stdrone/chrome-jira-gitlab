<template>
  <div>
    <div class="text-center m-4">
      <h1 class="text-2xl font-bold underline pb-6">Jira-Gitlab site config</h1>
    </div>
    <div>
      <n-form
        v-if="edit"
        label-placement="left"
        label-width="150px"
      >
        <n-form-item label="Jira site">
          <n-input v-model:value="edit.jira" />
        </n-form-item>
        <n-form-item label="Gitlab site">
          <n-input v-model:value="edit.gitlab" />
        </n-form-item>
        <n-form-item label="Gitlab Token">
          <n-input v-model:value="edit.token" />
        </n-form-item>
        <n-form-item label="MR title prefix">
          <n-input v-model:value="edit.mrTitlePrefix" />
        </n-form-item>
      </n-form>
    </div>
    <div v-if="edit">
      <n-data-table
        :columns="columns"
        :data="projects"
        :row-key="rowKey"
        :pagination="pagination"
      />
    </div>
    <div class="add m-4">
      <n-select
        v-model:value="addProject"
        filterable
        clearable
        value-field="id"
        label-field="name"
        :loading="loading"
        :options="projectOptions"
        placeholder="Search branches"
        @search="handleProjectSearch"
      />
      <n-button
        type="primary"
        :disabled="!addProject"
        @click="add"
      >
        Add
      </n-button>
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
import {
  DataTableColumns,
  NButton,
  NDataTable,
  NForm,
  NFormItem,
  NInput,
  NPopconfirm,
  NSelect,
} from 'naive-ui'
import { RowData } from 'naive-ui/es/data-table/src/interface'
import { AppConfig, GitLabApi, Project } from '@/models'

const router = useRouter()
const route = useRoute()

const appConfig = useAppConfig()

const gitAPI = ref<GitLabApi>()
const loading = ref<boolean>()
const addProject = ref<number>()
const projectOptions = ref<Project[]>([])

const pagination = {
  pageSize: 7,
}

const rowKey = (row: RowData) => row.index
const getProject = () => {
  const config =
    appConfig.configData[Number.parseInt(route.params.index as string)]
  gitAPI.value = new GitLabApi({
    url: config.gitlab,
    token: config.token,
  })
  return Object.assign({}, config)
}

const edit = ref<AppConfig>(getProject())
const projects = computed(() => {
  return edit.value.projects.map((x, index) => {
    return { ...x, index }
  })
})

const createColumns = (): DataTableColumns<RowData> => [
  {
    title: 'ID',
    key: 'id',
    sorter: 'default',
    ellipsis: true,
    width: 150,
  },
  {
    title: 'Name',
    key: 'name',
    sorter: 'default',
    ellipsis: true,
  },
  {
    title: 'Actions',
    align: 'center',
    key: 'edit',
    render: (rowData: RowData) => {
      return [
        h(
          NButton,
          {
            size: 'small',
            onClick: () =>
              router.push(`/edit/${route.params.index}/${rowData.index}`),
          },
          { default: () => 'Edit' }
        ),
        h(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          NPopconfirm as any,
          {
            positiveText: 'Yes',
            negativeText: 'No',
            onPositiveClick: () => {
              appConfig.configData[
                Number.parseInt(route.params.index as string)
              ].projects.splice(rowData.index, 1)
            },
            trigger: 'click',
          },
          {
            default: () => 'Delete element?',
            trigger: () =>
              h(
                NButton,
                {
                  size: 'small',
                },
                { default: () => 'Delete' }
              ),
          }
        ),
      ]
    },
  },
]

const handleProjectSearch = async (query: string) => {
  if (!query.length || !gitAPI.value) {
    projectOptions.value = []
    return
  }
  loading.value = true
  try {
    projectOptions.value = await gitAPI.value.projects({ search: query })
  } finally {
    loading.value = false
  }
}

const columns = createColumns()

const save = () => {
  const config = appConfig.configData ?? []
  const index = Number.parseInt(route.params.index as string)
  if (config[index] && edit.value) {
    config[index] = edit.value
    appConfig.save(config)
    router.push('/')
  }
}

const add = () => {
  if (edit.value && projectOptions.value && addProject.value) {
    const [proj] = projectOptions.value.filter((x) => x.id === addProject.value)
    if (proj) edit.value.projects.push(proj)
  }
}

const back = () => {
  appConfig.reload()
  router.push('/')
}
</script>

<style scoped>
.add {
  display: grid;
  grid-template-columns: 90% 9%;
  gap: 1%;
}
</style>
