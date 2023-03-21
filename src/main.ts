import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueCropper from 'vue-cropper'
import App from './App.vue'
import router from './router'
import registerFormateTimeDirective from '@/directives/formateDate'
import 'vue-cropper/dist/index.css'
import '@/assets/styles/index.scss'
import '@/router/permission'
import 'uno.css'

const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(VueCropper)

registerFormateTimeDirective(app)

app.mount('#app')

export default app
