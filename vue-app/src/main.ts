import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createHead } from '@unhead/vue/client'

import App from './App.vue'
import router from './router'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBars,
  faCalendarAlt,
  faCircleQuestion,
  faSpinner,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add({
  faCalendarAlt,
  faUserPlus,
  faCircleQuestion,
  faBars,
  faSpinner,
})

// locales/fr.json
import fr from './locales/fr.json'
const i18n = createI18n({
  locale: 'fr',
  messages: {
    fr: fr,
  },
})
const app = createApp(App)

const head = createHead()

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(head)

app.component('FontAwesomeIcon', FontAwesomeIcon)

app.mount('#app')
