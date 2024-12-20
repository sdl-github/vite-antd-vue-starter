import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueCropper from 'vue-cropper'
import VueTippy from 'vue-tippy'
import Antd from 'ant-design-vue'
import App from './App.vue'
import router from './router'
import registerFormateTimeDirective from '@/directives/formateDate'

// import 'ant-design-vue/es/message/style/css'
// import 'ant-design-vue/es/notification/style/css'
import 'vue-cropper/dist/index.css'
import '@/assets/styles/index.scss'
import '@/router/permission'
import 'uno.css'

const pinia = createPinia()
const app = createApp(App)
app.use(Antd)
app.use(router)
app.use(pinia)
app.use(VueCropper)
app.use(VueTippy, {
  directive: 'tippy',
  component: 'tippy',
})
registerFormateTimeDirective(app)

app.mount('#app')

export default app
