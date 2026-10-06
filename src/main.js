import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify, Dialog } from 'quasar'
import es from 'quasar/lang/es'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'
import './style.css'
import App from './App.vue'
import router from './router'
import { useLibrary } from './stores/library'

const app = createApp(App)
app.use(createPinia()).use(router).use(Quasar, { plugins: { Notify, Dialog }, lang: es })
useLibrary().init().finally(() => app.mount('#app'))
