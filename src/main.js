import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './app/router'
import { bootstrap } from './app/bootstrap'

const app = createApp(App)

// Bootstrap the app (Pinia, interceptors, etc.)
bootstrap(app)

// Install router
app.use(router)

// Mount app
app.mount('#app')

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker registration failed, app still works without it
        })
    })
}
