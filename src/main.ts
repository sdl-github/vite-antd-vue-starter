import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import '@unocss/reset/tailwind-compat.css'
import './styles/main.css'
import 'uno.css'
import './router/permission'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
