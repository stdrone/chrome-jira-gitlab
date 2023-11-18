import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '../assets/base.scss'
import App from './app.vue'
import './index.scss'

const pinia = createPinia()

createApp(App).use(pinia).mount('#app')
