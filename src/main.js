import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// global styles (tailwind)
import './index.css'


const app = createApp(App)

app.use(router)

app.mount('#app')
