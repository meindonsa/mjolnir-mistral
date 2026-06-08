import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/core/router'

export function createClientApp() {
  const app = createApp(App)
  const pinia = createPinia()
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
  })

  app.use(pinia)
  app.use(router)

  return { app, router, pinia }
}

const { app, router } = createClientApp()
router.isReady().then(() => app.mount('#app'))