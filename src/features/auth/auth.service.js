import apiClient from '../../services/api'

// Transform user data from API to app format
const transformUserData = (userData) => {
    if (!userData) return null

    // Transform roles from array of objects to array of strings
    const roles = Array.isArray(userData.roles)
        ? userData.roles.map(role => typeof role === 'string' ? role : role.kode)
        : []

    return {
        ...userData,
        roles,
    }
}

export const authService = {
    async login(username, password) {
        try {
            const response = await apiClient.post('/auth/login', {
                username,
                password,
            })

            // Transform the response data
            if (response.data?.data) {
                return {
                    ...response.data.data,
                    user: transformUserData(response.data.data.user)
                }
            }

            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    },

    async logout(refreshToken) {
        try {
            await apiClient.post('/auth/logout', {
                refreshToken,
            })
        } catch (error) {
            // Ignore logout errors
            console.error('Logout error:', error)
        }
    },

    async refreshToken(refreshToken) {
        try {
            const response = await apiClient.post('/auth/refresh', {
                refreshToken,
            })

            // Transform the response data
            if (response.data?.data) {
                return {
                    ...response.data.data,
                    user: transformUserData(response.data.data.user)
                }
            }

            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    },
}
