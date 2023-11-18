<template>
  <div class="text-center m-4">
    <h1 class="text-2xl font-bold underline pb-6">Jira-Gitlab options</h1>
    <div>
      <n-data-table
        :columns="columns"
        :data="configs"
        :row-key="rowKey"
        :pagination="pagination"
      />
    </div>
    <div class="text-center m-4">
      <n-button
        type="primary"
        @click="add"
      >
        Add
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppConfig, Project } from '@/models'
import { useAppConfig } from '@/store/store'
import {
  DataTableColumns,
  NButton,
  NCheckbox,
  NDataTable,
  NPopconfirm,
} from 'naive-ui'
import { InternalRowData, RowData } from 'naive-ui/es/data-table/src/interface'
const router = useRouter()
const appConfig = useAppConfig()

const pagination = {
  pageSize: 7,
}

const rowKey = (row: RowData) => row.rn

const getConfig = () => {
  return appConfig.configData.map((x, index) => {
    return { ...x, hasToken: !!x.token, index }
  })
}

const configs = ref<AppConfig[]>()
configs.value = getConfig()

const createColumns = (): DataTableColumns<RowData> => [
  {
    title: 'Gitlab site',
    key: 'gitlab',
    sorter: 'default',
    ellipsis: true,
    width: 300,
  },
  {
    title: 'Jira site',
    key: 'jira',
    sorter: 'default',
    ellipsis: true,
    width: 300,
  },
  {
    title: 'Token',
    key: 'hasToken',
    align: 'center',
    sorter: 'default',
    render: (rowData: InternalRowData) => {
      return h('div', { class: 'checkbox-column' }, [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        h(NCheckbox as any, { checked: rowData.hasToken }),
      ])
    },
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
            onClick: () => router.push(`/edit/${rowData.index}`),
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
              appConfig.configData.splice(rowData.index, 1)
              appConfig.save(appConfig.configData)
              configs.value = getConfig()
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

const columns = createColumns()

const add = () => {
  const config = { projects: [] as Project[] } as AppConfig
  const newIndex = appConfig.configData.push(config) - 1
  router.push(`/edit/${newIndex}`)
}
</script>

<style scoped></style>
