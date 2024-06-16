import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueSSE from 'vue-sse';
import { WagmiPlugin } from '@wagmi/vue'
import { config } from './config'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

const queryClient = new QueryClient()

const app = createApp(App)
app.use(router,VueSSE)
app.use(WagmiPlugin, { config })
app.use(VueQueryPlugin, { queryClient })
app.mount('#app')
