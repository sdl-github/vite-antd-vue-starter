import {createApp} from 'vue';
import router from './router';
import App from './App.vue';
import {createPinia} from 'pinia';
import Antd from 'ant-design-vue';
import '@/assets/styles/index.scss'
import '@/router/permission'
import 'ant-design-vue/dist/antd.css';

const pinia = createPinia()
const app = createApp(App);
app.use(router);
app.use(pinia)
app.use(Antd)
app.mount('#app');
