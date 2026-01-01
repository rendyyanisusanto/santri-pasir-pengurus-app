import apiClient from '../../services/api'

export const presensiService = {
    async getActivePresensiSettings() {
        try {
            const response = await apiClient.get('/presensi-setting', {
                params: {
                    is_aktif: true,
                    limit: 100
                }
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    },

    async getSantriByKamar(kamarId) {
        try {
            const response = await apiClient.get(`/santri?kamar_id=${kamarId}`)
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    },

    async getPresensi(tanggal, kamar_id, presensi_setting_id) {
        try {
            const response = await apiClient.get('/presensi', {
                params: {
                    tanggal,
                    kamar_id,
                    presensi_setting_id,
                },
            })
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    },

    async submitPresensi(data) {
        try {
            const response = await apiClient.post('/presensi', data)
            return response.data
        } catch (error) {
            throw error.response?.data || error
        }
    },
}
