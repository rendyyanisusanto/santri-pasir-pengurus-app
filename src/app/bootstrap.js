import { createPinia } from 'pinia'
import { setupTokenRefresh } from '../services/refresh-token'
import { useAuthStore } from './store/auth.store'

export const bootstrap = (app) => {
    // Create and install Pinia
    const pinia = createPinia()
    app.use(pinia)

    // Initialize auth store from localStorage
    const authStore = useAuthStore()
    authStore.initFromStorage()

    // Setup Axios interceptors for token refresh
    setupTokenRefresh()

    return { pinia, authStore }
}
