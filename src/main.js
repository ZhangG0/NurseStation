import { createApp } from 'vue'
import { createPinia } from 'pinia'
//注册pinia
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"; //持久化
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
//引入elementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入iconfont
import './assets/style/fonts/iconfont.css'
//引入vant
import 'vant/es/toast/style';
import 'vant/es/dialog/style';

import QrReader from 'vue3-qr-reader';

import App from './App.vue'
import router from './router'

// import Vconsole from 'vconsole'
// let vConsole = new Vconsole()
// export default vConsole;
const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.use(pinia)
app.use(QrReader);
app.mount('#app')
