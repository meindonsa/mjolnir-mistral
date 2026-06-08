import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import { renderToString } from '@vue/server-renderer'
import App from './App.vue'
import { routes } from '@/core/router'

export async function render(url: string) {
  const app = createSSRApp(App)
  const pinia = createPinia()
  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  app.use(pinia)
  app.use(router)

  await router.push(url)
  await router.isReady()

  const html = await renderToString(app)
  const state = JSON.stringify(pinia.state.value)

  return { html, state }
}
