import apiClient from '../../services/api'

export const santriService = {
    async getSantri(params = {}) {
        try {
            const { page = 1, limit = 10, search = '', kamar_id } = params

            const response = await apiClient.get('/santri', {
                params: {
                    page,
                    limit,
                    search,
                    kamar_id,
                    check_date: params.check_date,
                },
            })

            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    },

    async getSantriById(id) {
        try {
            const response = await apiClient.get(`/santri/${id}`)
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    },
}
