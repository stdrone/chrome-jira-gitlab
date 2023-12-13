<template>
  <div>
    <div class="branchname">
      <n-select
        v-model:value="prefix"
        :options="prefixOptions"
      />
      <div class="issue">
        <n-text>{{ config.issue }}</n-text>
      </div>
      <n-input
        v-model:value="postfix"
        placeholder="Postfix"
      />
    </div>
    <div class="title">
      <n-input v-model:value="mrTitle" />
    </div>
    <div class="projects">
      <n-data-table
        :columns="columns"
        :data="projects"
        :row-key="rowKey"
        :pagination="pagination"
        @update:checked-row-keys="handleCheck"
      />
    </div>
    <div>
      <n-select
        v-model:value="branch"
        filterable
        clearable
        value-field="name"
        label-field="name"
        :loading="loading"
        :options="branchOptions"
        placeholder="Search branches"
        :disabled="checkedProjects.length === 0"
        @search="handleBranchSearch"
      />
    </div>
    <div class="create">
      <n-button
        :disabled="checkedProjects.length === 0 || !branch || !mrTitle"
        @click="createBrahcnes"
      >
        Create branches
      </n-button>
    </div>
    <div
      v-if="resultLog"
      class="log"
    >
      <div
        v-for="(log, index) in resultLog"
        :key="index"
      >
        {{ log }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppConfig, BranchInfo, GitLabApi } from '@/models'
import {
  NSelect,
  NInput,
  NText,
  NDataTable,
  NButton,
  DataTableColumns,
  DataTableRowKey,
} from 'naive-ui'
import { RowData } from 'naive-ui/es/data-table/src/interface'

const props = defineProps({
  config: {
    required: true,
    type: Object as PropType<AppConfig>,
  },
})

const branch = ref<string>('')
const prefix = ref<string>()
const postfix = ref<string>('')
const mrTitle = ref<string>()
const resultLog = ref<string[]>()

const prefixOptions = ['feature/', 'fix/'].map((x) => {
  return { label: x, value: x }
})

const createColumns = (): DataTableColumns<RowData> => [
  {
    type: 'selection',
  },
  {
    title: 'Project name',
    key: 'name',
    sorter: 'default',
  },
]

const columns = createColumns()
const rowKey = (row: RowData) => row.id
const checkedProjects = ref<DataTableRowKey[]>([])
const handleCheck = (rowKeys: DataTableRowKey[]) => {
  checkedProjects.value = rowKeys
}
const pagination = {
  pageSize: 7,
}

const projects = props.config.projects.map((x) => {
  return {
    id: x.id,
    name: x.name,
  }
})
const loading = ref<boolean>()
const branchOptions = ref<BranchInfo[]>([])
const gitAPI = ref<GitLabApi>()

const handleBranchSearch = async (query: string) => {
  const [project] = checkedProjects.value
  if (!query.length || !project || !gitAPI.value) {
    branchOptions.value = []
    return
  }
  loading.value = true
  try {
    branchOptions.value = await gitAPI.value.branches({
      project: project as number,
      search: query,
    })
  } finally {
    loading.value = false
  }
}

const createBrahcnes = () => {
  checkedProjects.value.forEach((x) => {
    resultLog.value = []
    const newBranch = `${prefix.value}${props.config.issue}${postfix.value}`
    if (
      gitAPI.value?.createBranch({
        project: x as number,
        sourceBranch: branch.value,
        newBranch: newBranch,
      })
    ) {
      resultLog.value.push('Branch created')
    } else {
      resultLog.value.push('Branch already exists')
    }
    if (
      gitAPI.value?.createMR({
        project: x as number,
        sourceBranch: branch.value,
        newBranch: newBranch,
        title: mrTitle.value ?? '',
      })
    )
      resultLog.value.push('MR created')
  })
}

watch(
  () => props.config,
  (value: AppConfig) => {
    mrTitle.value = `${value.mrTitlePrefix}[${value.issue}] ${value.issueName}`
    prefix.value = prefixOptions[0].value
    gitAPI.value = new GitLabApi({
      url: value.gitlab,
      token: value.token,
    })
  },
  { deep: true }
)
</script>

<style scoped lang="scss">
.branchname {
  display: grid;
  grid-template-columns: 33% 32% 33%;
  gap: 1%;

  .issue {
    position: relative;

    > span {
      margin: 0;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.create {
  text-align: center;
}

.log {
  margin-left: 15px;
}
</style>
