<template>
  <div class="fixed inset-0 bg-black/50 flex items-end z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h2 class="text-lg font-bold text-gray-900">Buat Izin Baru</h2>
        <button
          @click="$emit('close')"
          class="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-5">
        <!-- Santri Selection Search -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Santri <span class="text-red-500">*</span>
          </label>
          
          <!-- Selected Santri Display -->
          <div v-if="selectedSantri" class="flex items-center justify-between p-3 bg-primary-50 border border-primary-200 rounded-xl mb-2">
            <div>
              <p class="font-bold text-primary-900">{{ selectedSantri.nama }}</p>
              <p class="text-xs text-primary-600">{{ selectedSantri.nis }}</p>
            </div>
            <button @click="clearSantri" type="button" class="text-primary-400 hover:text-primary-600 p-1">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Search Input -->
          <div v-else class="relative">
            <input
              type="text"
              v-model="searchQuery"
              @input="handleSearch"
              placeholder="Ketik nama santri..."
              class="w-full bg-gray-50 border-0 text-gray-900 text-sm font-medium rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-primary-500 p-3 pl-10"
            />
            <div class="absolute left-3 top-3 text-gray-400">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </div>

            <!-- Search Results Dropdown -->
            <div v-if="searchQuery && !selectedSantri" class="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 max-h-48 overflow-y-auto">
              <div v-if="loadingSantri" class="p-3 text-center text-sm text-gray-500">
                Mencari...
              </div>
              <div v-else-if="santriList.length === 0" class="p-3 text-center text-sm text-gray-500">
                Tidak ada santri ditemukan
              </div>
              <button
                v-for="santri in santriList"
                :key="santri.id"
                @click="selectSantri(santri)"
                type="button"
                class="w-full text-left p-3 hover:bg-gray-50 border-b last:border-0 border-gray-50 transition-colors"
              >
                <p class="font-medium text-gray-900 text-sm">{{ santri.nama }}</p>
                <p class="text-xs text-gray-500">{{ santri.nis }}</p>
              </button>
            </div>
          </div>
        </div>

        <!-- Jenis Izin -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Jenis Izin <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.jenis_izin_id"
            required
            class="w-full bg-gray-50 border-0 text-gray-900 text-sm font-medium rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-primary-500 p-3"
          >
            <option value="">Pilih Jenis Izin</option>
            <option v-for="jenis in jenisIzinList" :key="jenis.id" :value="jenis.id">
              {{ jenis.nama }}
            </option>
          </select>
        </div>

        <!-- Tanggal Keluar -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Tanggal Keluar <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.tanggal_keluar"
            type="date"
            required
            class="w-full bg-gray-50 border-0 text-gray-900 text-sm font-medium rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-primary-500 p-3"
          />
        </div>

        <!-- Tanggal Kembali -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Tanggal Kembali
          </label>
          <input
            v-model="formData.tanggal_kembali"
            type="date"
            :min="formData.tanggal_keluar"
            class="w-full bg-gray-50 border-0 text-gray-900 text-sm font-medium rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-primary-500 p-3"
          />
        </div>

        <!-- Alasan -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Alasan
          </label>
          <textarea
            v-model="formData.alasan"
            rows="3"
            placeholder="Tuliskan alasan izin..."
            class="w-full bg-gray-50 border-0 text-gray-900 text-sm font-medium rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-primary-500 p-3 resize-none"
          ></textarea>
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-2">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-sm hover:bg-gray-200 active:scale-95 transition-all"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="flex-1 bg-primary-600 text-white py-3 rounded-xl font-bold text-sm hover:bg-primary-700 active:scale-95 transition-all disabled:opacity-50"
          >
            {{ submitting ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../app/store/auth.store'
import { izinSantriService } from './izin-santri.service'
import { santriService } from '../santri/santri.service'

export default {
  name: 'IzinSantriForm',
  emits: ['close', 'saved'],
  setup(props, { emit }) {
    const authStore = useAuthStore()
    const submitting = ref(false)
    const santriList = ref([])
    const jenisIzinList = ref([])
    
    // Search related
    const searchQuery = ref('')
    const loadingSantri = ref(false)
    const selectedSantri = ref(null)
    let searchTimeout = null

    const formData = ref({
      santri_id: '',
      jenis_izin_id: '',
      tanggal_keluar: new Date().toISOString().split('T')[0],
      tanggal_kembali: '',
      alasan: ''
    })

    const handleSearch = () => {
      if (searchTimeout) clearTimeout(searchTimeout)
      
      if (!searchQuery.value) {
        santriList.value = []
        return
      }

      loadingSantri.value = true
      searchTimeout = setTimeout(async () => {
        try {
          const response = await santriService.getSantri({
            limit: 10,
            search: searchQuery.value
          })
          santriList.value = response.data?.data || []
        } catch (error) {
          console.error('Error searching santri:', error)
          santriList.value = []
        } finally {
          loadingSantri.value = false
        }
      }, 300) // 300ms debounce
    }

    const selectSantri = (santri) => {
      selectedSantri.value = santri
      formData.value.santri_id = santri.id
      searchQuery.value = ''
      santriList.value = []
    }

    const clearSantri = () => {
      selectedSantri.value = null
      formData.value.santri_id = ''
      searchQuery.value = ''
      santriList.value = []
    }

    const loadJenisIzin = async () => {
      try {
        const response = await izinSantriService.getJenisIzin()
        jenisIzinList.value = response.data || []
      } catch (error) {
        console.error('Error loading jenis izin:', error)
      }
    }

    const handleSubmit = async () => {
      submitting.value = true
      try {
        const submitData = {
          santri_id: parseInt(formData.value.santri_id),
          jenis_izin_id: parseInt(formData.value.jenis_izin_id),
          tanggal_keluar: formData.value.tanggal_keluar,
          tanggal_kembali: formData.value.tanggal_kembali || null,
          alasan: formData.value.alasan || null
        }

        await izinSantriService.createIzin(submitData)
        alert('Izin berhasil dibuat')
        emit('saved')
      } catch (error) {
        console.error('Error creating izin:', error)
        const errorMessage = error.message || 'Gagal membuat izin'
        alert(errorMessage)
      } finally {
        submitting.value = false
      }
    }

    onMounted(() => {
      loadJenisIzin()
    })

    return {
      formData,
      submitting,
      santriList,
      jenisIzinList,
      handleSubmit,
      searchQuery,
      loadingSantri,
      selectedSantri,
      handleSearch,
      selectSantri,
      clearSantri
    }
  }
}
</script>
