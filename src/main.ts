import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@unocss/reset/tailwind-compat.css'

import App from './App.vue'
import router from './router'
import './styles/main.css'
import './styles/reset.scss'
import './router/permission'
import 'uno.css'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')
