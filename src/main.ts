import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import registerFormateTimeDirective from '@/directives/formateDate'
import { createPinia } from 'pinia';
import Antd from 'ant-design-vue';
import VueCropper from "vue-cropper";

import 'vue-cropper/dist/index.css'
import '@/assets/styles/index.scss'
import '@/router/permission'
import 'ant-design-vue/dist/antd.css';
import 'uno.css'

const pinia = createPinia()
const app = createApp(App);
app.use(router);
app.use(pinia)
app.use(Antd)
app.use(VueCropper)

registerFormateTimeDirective(app)

app.mount('#app');

export default app
