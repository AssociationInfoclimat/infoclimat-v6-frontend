import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createRouter, createMemoryHistory } from 'vue-router'
import { renderToString } from 'vue/server-renderer'
import { createHead, renderSSRHead } from '@unhead/vue/server'

import App from './App.vue'
import { routes } from './router/routes'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBars,
  faCalendarAlt,
  faCircleQuestion,
  faSpinner,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import fr from './locales/fr.json'

library.add({ faCalendarAlt, faUserPlus, faCircleQuestion, faBars, faSpinner })

export { routes }

export async function render(url: string): Promise<{ body: string; headTags: string }> {
  const app = createSSRApp(App)
  const head = createHead()

  const router = createRouter({
    history: createMemoryHistory(),
    routes,
  })

  const pinia = createPinia()
  const i18n = createI18n({
    locale: 'fr',
    messages: { fr },
  })

  app.use(head)
  app.use(pinia)
  app.use(router)
  app.use(i18n)
  app.component('FontAwesomeIcon', FontAwesomeIcon)

  await router.push(url)
  await router.isReady()

  const body = await renderToString(app)
  const { headTags } = await renderSSRHead(head)

  return { body, headTags }
}
