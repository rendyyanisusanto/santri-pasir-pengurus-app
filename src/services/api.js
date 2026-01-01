import axios from 'axios'
import { API_BASE_URL } from '../utils/env'
import { useAuthStore } from '../app/store/auth.store'
import router from '../app/router'

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 seconds
})

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false
// Queue to hold pending requests while refreshing
let failedQueue = []

/**
 * Process queued requests after token refresh
 */
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })

    failedQueue = []
}

/**
 * Request interceptor - attach access token to all requests
 */
apiClient.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore()
        const token = authStore.accessToken

        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

/**
 * Response interceptor - handle 401 errors and auto-refresh token
 */
apiClient.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config

        // Check if error is 401 and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`
                        return apiClient(originalRequest)
                    })
                    .catch(err => {
                        return Promise.reject(err)
                    })
            }

            originalRequest._retry = true
            isRefreshing = true

            const authStore = useAuthStore()
            const refreshToken = authStore.refreshToken

            if (!refreshToken) {
                // No refresh token available, logout
                console.error('No refresh token available')
                authStore.logout()
                router.push('/login')
                return Promise.reject(error)
            }

            try {
                // Call refresh endpoint
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refreshToken: refreshToken
                })

                const { accessToken, refreshToken: newRefreshToken } = response.data.data

                // Update tokens in store
                if (newRefreshToken) {
                    // If backend returns new refresh token, update both
                    authStore.setAuth(accessToken, newRefreshToken, authStore.user)
                } else {
                    // If only access token is returned, just update access token
                    authStore.updateAccessToken(accessToken)
                }

                // Update the authorization header
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
                originalRequest.headers.Authorization = `Bearer ${accessToken}`

                // Process all queued requests
                processQueue(null, accessToken)

                // Retry the original request
                return apiClient(originalRequest)
            } catch (refreshError) {
                // Refresh failed, logout user
                console.error('Token refresh failed:', refreshError)
                processQueue(refreshError, null)
                authStore.logout()
                router.push('/login')
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export default apiClient
