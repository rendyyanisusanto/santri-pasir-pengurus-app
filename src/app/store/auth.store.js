import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: localStorage.getItem('accessToken') || null,
        refreshToken: localStorage.getItem('refreshToken') || null,
        user: JSON.parse(localStorage.getItem('user') || 'null'),
    }),

    getters: {
        isAuthenticated: (state) => {
            const hasToken = !!state.accessToken && !!state.user
            console.log('isAuthenticated check:', { hasToken, user: state.user })
            return hasToken
        },
        currentUser: (state) => state.user,
        userRoles: (state) => {
            if (!state.user || !state.user.roles) return []
            // Ensure roles is always an array of strings
            return Array.isArray(state.user.roles) ? state.user.roles : []
        },
        pengurusData: (state) => state.user?.pengurus || null,
    },

    actions: {
        setAuth(accessToken, refreshToken, user) {
            console.log('Setting auth:', { accessToken, refreshToken, user })

            this.accessToken = accessToken
            this.refreshToken = refreshToken
            this.user = user

            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken)
            localStorage.setItem('user', JSON.stringify(user))
        },

        updateAccessToken(accessToken) {
            this.accessToken = accessToken
            localStorage.setItem('accessToken', accessToken)
        },

        logout() {
            this.accessToken = null
            this.refreshToken = null
            this.user = null

            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            localStorage.removeItem('user')
        },

        initFromStorage() {
            const accessToken = localStorage.getItem('accessToken')
            const refreshToken = localStorage.getItem('refreshToken')
            const userStr = localStorage.getItem('user')

            if (accessToken && refreshToken && userStr) {
                this.accessToken = accessToken
                this.refreshToken = refreshToken
                this.user = JSON.parse(userStr)
                console.log('Auth initialized from storage:', this.user)
            }
        },
    },
})
