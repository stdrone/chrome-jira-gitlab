import { AppConfig } from '@/models'
import { defineStore } from 'pinia'

const readConfig = () => {
  const configs: AppConfig[] = JSON.parse(
    window.localStorage.getItem('configData') || '[{}]'
  )
  configs.forEach((x) => {
    x.mrTitlePrefix = x.mrTitlePrefix ?? 'Draft: '
  })
  return configs
}

export const useAppConfig = defineStore('appConfig', {
  state: (): { configData: AppConfig[] } => ({
    configData: readConfig(),
  }),
  actions: {
    save(value: AppConfig[]) {
      this.configData = value
      window.localStorage.setItem('configData', JSON.stringify(value))
    },
    reload() {
      this.configData = readConfig()
    },
  },
})
