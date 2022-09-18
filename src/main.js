import { createApp } from 'vue'
import { createPinia } from 'pinia'
//引入elementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//引入iconfont
import './assets/style/fonts/iconfont.css'

import App from './App.vue'
import router from './router'


import './assets/main.css'

const app = createApp(App)

app.use(ElementPlus)
app.use(createPinia())
app.use(router)

app.mount('#app')
