import apiClient from '../../services/api'

export const izinSantriService = {
    async getIzinList(params = {}) {
        try {
            const response = await apiClient.get('/izin-santri', { params })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    },

    async getIzinById(id) {
        try {
            const response = await apiClient.get(`/izin-santri/${id}`)
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    },

    async createIzin(data) {
        try {
            const response = await apiClient.post('/izin-santri', data)
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    },

    async updateIzin(id, data) {
        try {
            const response = await apiClient.put(`/izin-santri/${id}`, data)
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    },

    async updateIzinStatus(id, status) {
        try {
            const response = await apiClient.patch(`/izin-santri/${id}/status`, { status })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    },

    async deleteIzin(id) {
        try {
            const response = await apiClient.delete(`/izin-santri/${id}`)
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    },

    async getJenisIzin() {
        try {
            const response = await apiClient.get('/jenis-izin', {
                params: { is_aktif: true }
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    }
}
