import api from './api'

export const kamarService = {
    async getKamar(params = {}) {
        const response = await api.get('/kamar', { params })
        return response.data
    },

    async getKamarById(id) {
        const response = await api.get(`/kamar/${id}`)
        return response.data
    }
}
