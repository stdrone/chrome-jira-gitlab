import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from '~pages'
import '../assets/base.scss'
import App from './app.vue'
import './index.scss'
import { createPinia } from 'pinia'

import Edit from './pages/edit.vue'
import Project from './pages/project.vue'

routes.push({
  path: '/edit/:index',
  component: Edit,
})
routes.push({
  path: '/edit/:index/:project',
  component: Project,
})
const pinia = createPinia()

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  if (to.path === '/') {
    return next('/options')
  }

  next()
})

createApp(App).use(router).use(pinia).mount('#app')
