<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <!-- Premium Gradient Header -->
    <div class="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 pb-24 pt-8 px-5 shadow-xl rounded-b-[2.5rem] relative overflow-hidden">
      <!-- Decorative circles -->
      <div class="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-black/10 blur-3xl pointer-events-none"></div>

      <div class="relative z-10 flex items-center justify-between mb-2">
        <button 
          @click="$router.back()" 
          class="p-2.5 rounded-xl bg-white/10 text-white backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all active:scale-95 touch-manipulation shadow-sm"
          aria-label="Kembali"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-white text-lg font-bold tracking-wide shadow-sm">Izin Santri</h1>
        <button
          v-if="canCreate"
          @click="showForm = true"
          class="p-2.5 rounded-xl bg-white/10 text-white backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all active:scale-95 shadow-sm"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        <div v-else class="w-10"></div>
      </div>
    </div>

    <main class="px-4 -mt-16 relative z-20 max-w-lg mx-auto">
      <!-- Filters Card -->
      <div class="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 p-5 mb-6">
        <div class="grid grid-cols-2 gap-3 mb-4">
          <select
            v-model="filters.status"
            @change="loadIzinList"
            class="bg-gray-50 border-0 text-gray-900 text-sm font-medium rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-primary-500 p-2.5"
          >
            <option value="">Semua Status</option>
            <option value="PENGAJUAN">Pengajuan</option>
            <option value="DISETUJUI">Disetujui</option>
            <option value="DITOLAK">Ditolak</option>
            <option value="SELESAI">Selesai</option>
          </select>

          <select
            v-model="filters.jenis_izin_id"
            @change="loadIzinList"
            class="bg-gray-50 border-0 text-gray-900 text-sm font-medium rounded-xl ring-1 ring-gray-200 focus:ring-2 focus:ring-primary-500 p-2.5"
          >
            <option value="">Semua Jenis</option>
            <option v-for="jenis in jenisIzinList" :key="jenis.id" :value="jenis.id">
              {{ jenis.nama }}
            </option>
          </select>
        </div>

        <!-- Kamar Filter for ASRAMA -->
        <div v-if="isAsramaRole" class="pt-4 border-t border-gray-100">
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Filter Kamar</label>
          <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
            <button 
              @click="selectKamar('')"
              class="whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all flex-shrink-0 border"
              :class="!filters.kamar_id 
                ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/30' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary-200 hover:bg-gray-50'"
            >
              Semua
            </button>
            <button 
              v-for="kamar in kamarOptions" 
              :key="kamar.value"
              @click="selectKamar(kamar.value)"
              class="whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all flex-shrink-0 border"
              :class="filters.kamar_id === kamar.value 
                ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/30' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary-200 hover:bg-gray-50'"
            >
              {{ kamar.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-4 gap-2 mb-6">
        <div class="bg-yellow-50 rounded-2xl p-3 text-center border border-yellow-100">
          <div class="text-2xl font-bold text-yellow-700">{{ stats.pengajuan }}</div>
          <div class="text-[10px] font-medium text-yellow-600 uppercase">Pengajuan</div>
        </div>
        <div class="bg-green-50 rounded-2xl p-3 text-center border border-green-100">
          <div class="text-2xl font-bold text-green-700">{{ stats.disetujui }}</div>
          <div class="text-[10px] font-medium text-green-600 uppercase">Disetujui</div>
        </div>
        <div class="bg-red-50 rounded-2xl p-3 text-center border border-red-100">
          <div class="text-2xl font-bold text-red-700">{{ stats.ditolak }}</div>
          <div class="text-[10px] font-medium text-red-600 uppercase">Ditolak</div>
        </div>
        <div class="bg-blue-50 rounded-2xl p-3 text-center border border-blue-100">
          <div class="text-2xl font-bold text-blue-700">{{ stats.selesai }}</div>
          <div class="text-[10px] font-medium text-blue-600 uppercase">Selesai</div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-primary-500 mb-3"></div>
        <span class="text-sm font-medium text-gray-400">Memuat data...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="izinList.length === 0" class="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-50 mb-4 text-gray-300">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p class="text-gray-900 font-bold">Belum ada data izin</p>
        <p class="text-gray-400 text-xs mt-1">Belum ada izin yang diajukan</p>
      </div>

      <!-- Izin List -->
      <div v-else class="space-y-3">
        <div
          v-for="izin in izinList"
          :key="izin.id"
          class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100"
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="font-bold text-gray-900 text-base">{{ izin.santri?.nama }}</h3>
              <p class="text-xs text-gray-500 mt-0.5">
                {{ getKamarNama(izin.santri) }} • NIS: {{ izin.santri?.nis }}
              </p>
            </div>
            <span
              class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase"
              :class="getStatusClass(izin.status)"
            >
              {{ izin.status }}
            </span>
          </div>

          <!-- Details -->
          <div class="space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span class="font-medium text-gray-700">{{ izin.jenisIzin?.nama }}</span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-gray-600">
                {{ formatDate(izin.tanggal_keluar) }}
                <span v-if="izin.tanggal_kembali"> - {{ formatDate(izin.tanggal_kembali) }}</span>
              </span>
            </div>

            <div v-if="izin.alasan" class="flex items-start gap-2 text-sm">
              <svg class="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span class="text-gray-600 line-clamp-2">{{ izin.alasan }}</span>
            </div>
          </div>

          <!-- Actions (conditional based on jenis izin) -->
          <div v-if="canApproveIzin(izin) && izin.status === 'PENGAJUAN'" class="flex gap-2">
            <button
              @click="approveIzin(izin.id)"
              class="flex-1 bg-green-500 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-green-600 active:scale-95 transition-all"
            >
              Setujui
            </button>
            <button
              @click="rejectIzin(izin.id)"
              class="flex-1 bg-red-500 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-600 active:scale-95 transition-all"
            >
              Tolak
            </button>
          </div>
        </div>
      </div>
    </main>

    <AppBottomNav />

    <!-- Form Modal -->
    <IzinSantriForm
      v-if="showForm"
      @close="showForm = false"
      @saved="handleFormSaved"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../app/store/auth.store'
import { ROLES, hasRole } from '../../utils/role'
import { izinSantriService } from './izin-santri.service'
import { kamarService } from '../../services/kamar.service'
import AppBottomNav from '../../components/layout/AppBottomNav.vue'
import IzinSantriForm from './IzinSantriForm.vue'

export default {
  name: 'IzinSantriPage',
  components: {
    AppBottomNav,
    IzinSantriForm
  },
  setup() {
    const authStore = useAuthStore()
    const izinList = ref([])
    const jenisIzinList = ref([])
    const kamarOptions = ref([])
    const loading = ref(false)
    const showForm = ref(false)
    const filters = ref({
      status: '',
      jenis_izin_id: '',
      kamar_id: ''
    })

    const isAsramaRole = computed(() => hasRole(authStore.currentUser, ROLES.ASRAMA))

    const canApprove = computed(() => {
      const roles = authStore.currentUser?.roles || []
      return roles.includes(ROLES.ADMIN) || 
             roles.includes(ROLES.ASRAMA) || 
             roles.includes(ROLES.PAU)
    })

    const canCreate = computed(() => {
      return true // All roles can create
    })

    const stats = computed(() => {
      return {
        pengajuan: izinList.value.filter(i => i.status === 'PENGAJUAN').length,
        disetujui: izinList.value.filter(i => i.status === 'DISETUJUI').length,
        ditolak: izinList.value.filter(i => i.status === 'DITOLAK').length,
        selesai: izinList.value.filter(i => i.status === 'SELESAI').length
      }
    })

    const getStatusClass = (status) => {
      switch (status) {
        case 'PENGAJUAN':
          return 'bg-yellow-100 text-yellow-700'
        case 'DISETUJUI':
          return 'bg-green-100 text-green-700'
        case 'DITOLAK':
          return 'bg-red-100 text-red-700'
        case 'SELESAI':
          return 'bg-blue-100 text-blue-700'
        default:
          return 'bg-gray-100 text-gray-700'
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    }

    const getKamarNama = (santri) => {
      if (!santri) return 'Kamar tidak diketahui'
      if (santri.kamarHistory && santri.kamarHistory.length > 0) {
        return santri.kamarHistory[0].kamar?.nama || 'Kamar tidak diketahui'
      }
      return 'Kamar tidak diketahui'
    }

    const canApproveIzin = (izin) => {
      const roles = authStore.currentUser?.roles || []
      const jenisIzinNama = izin.jenisIzin?.nama?.toUpperCase()
      
      const isAdmin = roles.includes(ROLES.ADMIN)
      const isUKP = roles.includes(ROLES.UKP)
      const isAsrama = roles.includes(ROLES.ASRAMA)
      const isPAU = roles.includes(ROLES.PAU)

      // SAKIT: Only UKP and ADMIN
      if (jenisIzinNama === 'SAKIT') {
        return isAdmin || isUKP
      }
      
      // Other izin types: ADMIN, ASRAMA, PAU
      return isAdmin || isAsrama || isPAU
    }

    const selectKamar = (kamarId) => {
      filters.value.kamar_id = kamarId
      loadIzinList()
    }

    const loadIzinList = async () => {
      loading.value = true
      try {
        const params = {
          ...filters.value,
          limit: 100
        }
        
        const response = await izinSantriService.getIzinList(params)
        izinList.value = response.data?.data || []
      } catch (error) {
        console.error('Error loading izin list:', error)
        alert('Gagal memuat data izin')
      } finally {
        loading.value = false
      }
    }

    const loadJenisIzin = async () => {
      try {
        const response = await izinSantriService.getJenisIzin()
        jenisIzinList.value = response.data || []
      } catch (error) {
        console.error('Error loading jenis izin:', error)
      }
    }

    const loadKamarOptions = async () => {
      if (!isAsramaRole.value) return
      
      try {
        const response = await kamarService.getKamar({ limit: 100 })
        const kamarData = response.data?.data || []
        kamarOptions.value = kamarData.map(kamar => ({
          value: kamar.id,
          label: kamar.nama
        }))
      } catch (error) {
        console.error('Error loading kamar options:', error)
      }
    }

    const approveIzin = async (id) => {
      if (!confirm('Yakin ingin menyetujui izin ini?')) return

      try {
        await izinSantriService.updateIzinStatus(id, 'DISETUJUI')
        alert('Izin berhasil disetujui')
        loadIzinList()
      } catch (error) {
        console.error('Error approving izin:', error)
        alert('Gagal menyetujui izin')
      }
    }

    const rejectIzin = async (id) => {
      if (!confirm('Yakin ingin menolak izin ini?')) return

      try {
        await izinSantriService.updateIzinStatus(id, 'DITOLAK')
        alert('Izin berhasil ditolak')
        loadIzinList()
      } catch (error) {
        console.error('Error rejecting izin:', error)
        alert('Gagal menolak izin')
      }
    }

    const handleFormSaved = () => {
      showForm.value = false
      loadIzinList()
    }

    onMounted(() => {
      loadJenisIzin()
      loadKamarOptions()
      loadIzinList()
    })

    return {
      izinList,
      jenisIzinList,
      kamarOptions,
      loading,
      showForm,
      filters,
      isAsramaRole,
      canApprove,
      canCreate,
      stats,
      getStatusClass,
      formatDate,
      getKamarNama,
      canApproveIzin,
      selectKamar,
      loadIzinList,
      approveIzin,
      rejectIzin,
      handleFormSaved
    }
  }
}
</script>
