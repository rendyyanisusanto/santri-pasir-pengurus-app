import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        profile: null,
        santriList: [],
        loading: false,
        error: null,
    }),

    getters: {
        kamarId: (state) => state.profile?.pengurus?.kamar_id || null,
        asramaId: (state) => state.profile?.pengurus?.asrama_id || null,
    },

    actions: {
        setProfile(profile) {
            this.profile = profile
        },

        setSantriList(santriList) {
            this.santriList = santriList
            // Cache for offline access
            localStorage.setItem('cachedSantriList', JSON.stringify(santriList))
        },

        loadCachedSantriList() {
            const cached = localStorage.getItem('cachedSantriList')
            if (cached) {
                this.santriList = JSON.parse(cached)
            }
        },

        setLoading(loading) {
            this.loading = loading
        },

        setError(error) {
            this.error = error
        },

        clearError() {
            this.error = null
        },
    },
})
