import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'

import App from './App.vue'
import router from './router'
import '@unocss/reset/tailwind-compat.css'
import './styles/main.css'
import './styles/reset.scss'
import 'uno.css'
import './router/permission'

const app = createApp(App)
const pinia = createPinia()
app.use(VueTippy)
app.use(pinia)
app.use(router)
app.mount('#app')
