import apiClient from './api'

let isRefreshing = false
let failedQueue = []

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

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken')

    if (!refreshToken) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        throw new Error('No refresh token available')
    }

    try {
        const response = await apiClient.post('/auth/refresh', {
            refreshToken: refreshToken
        })

        const { accessToken } = response.data
        localStorage.setItem('accessToken', accessToken)

        return accessToken
    } catch (error) {
        // If refresh fails, clear storage and redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        throw error
    }
}

export const setupTokenRefresh = () => {
    // Request interceptor
    apiClient.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('accessToken')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )

    // Response interceptor
    apiClient.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    // Add request to queue
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

                try {
                    const newToken = await refreshAccessToken()
                    processQueue(null, newToken)
                    originalRequest.headers.Authorization = `Bearer ${newToken}`
                    return apiClient(originalRequest)
                } catch (err) {
                    processQueue(err, null)
                    return Promise.reject(err)
                } finally {
                    isRefreshing = false
                }
            }

            return Promise.reject(error)
        }
    )
}
