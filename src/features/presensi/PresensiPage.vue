<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <!-- Custom Gradient Header -->
    <div class="bg-gradient-to-br from-primary-600 to-primary-800 pb-24 pt-6 px-4 shadow-lg rounded-b-[2.5rem] relative z-10">
      <div class="flex items-center justify-between mb-2">
        <button 
          @click="$router.back()" 
          class="p-2 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Kembali"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-white text-xl font-bold tracking-wide shadow-sm">Isi Presensi</h1>
        <div class="w-10"></div> <!-- Spacer -->
      </div>
      <p class="text-primary-100 text-center text-sm -mt-2 mb-4 font-medium opacity-90">
        {{ presensiDateLong || 'Isi kehadiran santri' }}
      </p>
    </div>

    <main class="px-4 -mt-16 relative z-20 max-w-lg mx-auto">
      <!-- Top Card: Date & Session -->
      <div class="bg-white rounded-3xl shadow-lg shadow-gray-200/50 border border-gray-100 p-5 mb-6">
        <!-- Date Selection -->
        <div class="mb-5">
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
            Tanggal
          </label>
          <div class="relative">
            <input
              v-model="presensiDate"
              type="date"
              class="w-full bg-gray-50 border-0 text-gray-900 text-base font-bold rounded-2xl ring-1 ring-gray-200 focus:ring-2 focus:ring-primary-500 block p-3.5 pr-10 appearance-none outline-none transition-all shadow-sm"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-primary-500">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
            </div>
          </div>
        </div>

        <!-- Session Selection (Segmented Control) -->
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">
            Sesi
          </label>
          <div class="bg-gray-50 p-1.5 rounded-2xl flex ring-1 ring-gray-200">
            <button
              v-for="sesi in sesiOptions"
              :key="sesi.value"
              @click="selectedSesiId = sesi.value"
              class="flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 relative z-10"
              :class="selectedSesiId === sesi.value 
                ? 'bg-white text-primary-600 shadow-md shadow-gray-200/50 ring-1 ring-black/5 transform scale-[1.02]' 
                : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100/50'"
            >
              {{ sesi.shortLabel || sesi.label }}
            </button>
            <div v-if="sesiOptions.length === 0" class="text-xs text-gray-400 py-2 px-3">
              Tidak ada sesi aktif
            </div>
          </div>
        </div>
      </div>

      <!-- Kamar Selection (for ASRAMA role) -->
      <div v-if="isAsramaRole" class="mb-6">
        <BaseSelect
          v-model="selectedKamarId"
          label="Pilih Kamar"
          placeholder="Pilih kamar"
          :options="kamarOptions"
          @update:modelValue="loadSantriByKamar"
        />
      </div>

      <!-- List Header -->
      <div class="flex items-center justify-between mb-4 px-2">
        <h2 class="text-lg font-bold text-gray-800">Daftar Santri</h2>
        <span class="bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {{ santriList.length }}
        </span>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col justify-center items-center py-12 text-gray-400">
        <div class="animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-primary-500 mb-3"></div>
        <span class="text-sm font-medium animate-pulse">Memuat data...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="santriList.length === 0" class="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 mx-2">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-50 mb-4 text-gray-300">
           <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
           </svg>
        </div>
        <p class="text-gray-900 font-bold">Tidak ada data santri</p>
        <p class="text-gray-400 text-xs mt-1">
          {{ isAsramaRole ? 'Silakan pilih kamar terlebih dahulu' : 'Belum ada santri di kamar ini' }}
        </p>
      </div>

      <!-- Santri List -->
      <div v-else class="space-y-3">
        <div
          v-for="santri in santriList"
          :key="santri.id"
          class="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 transition-transform active:scale-[0.99]"
        >
          <!-- Santri Info -->
          <div class="flex items-center gap-4 mb-5">
             <div class="relative">
                <div class="w-14 h-14 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm">
                   <span v-if="!santri.foto" class="text-primary-600 font-bold text-lg">{{ getInitials(santri.nama) }}</span>
                   <img v-else :src="santri.foto" class="w-full h-full object-cover" />
                </div>
                <!-- Checkmark if status selected -->
                <div 
                  v-if="presensiData[santri.id]" 
                  class="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white text-white shadow-sm"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
             </div>
             
             <div class="flex-1 min-w-0">
               <h3 class="font-bold text-gray-900 truncate text-base">{{ santri.nama }}</h3>
               <p class="text-xs text-gray-500 font-medium flex items-center gap-1">
                 NIS: <span class="bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">{{ santri.nis || '-' }}</span>
               </p>
             </div>
          </div>

           <!-- Status Buttons -->
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="status in presensiStatuses"
              :key="status.value"
              @click="handleStatusClick(santri.id, status.value)"
              :disabled="saving || isStatusDisabled(santri, status.value)"
              class="flex flex-col items-center justify-center py-3 rounded-2xl border transition-all duration-200 relative overflow-hidden group active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="getStatusButtonClass(santri.id, status.value)"
            > 
              <span class="text-lg font-black mb-0.5 relative z-10 tracking-tight">{{ status.value[0] }}</span>
              <span class="text-[10px] font-bold relative z-10 opacity-90">{{ status.label }}</span>
            </button>
          </div>

          <!-- Saving indicator for this santri -->
          <div v-if="saving" class="mt-3 flex items-center justify-center gap-2 text-xs text-primary-600">
            <div class="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <span class="font-medium">Menyimpan...</span>
          </div>
        </div>
      </div>
    </main>

    <AppBottomNav />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../../app/store/auth.store'
import { ROLES, hasRole } from '../../utils/role'
import { presensiService } from './presensi.service'
import { santriService } from '../santri/santri.service'
import { kamarService } from '../../services/kamar.service'
import AppBottomNav from '../../components/layout/AppBottomNav.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'

export default {
  name: 'PresensiPage',
  components: {
    AppBottomNav,
    BaseButton,
    BaseSelect,
  },
  setup() {
    const authStore = useAuthStore()
    
    const santriList = ref([])
    const loading = ref(false)
    const saving = ref(false)
    const selectedKamarId = ref('')
    const selectedSesiId = ref('')
    const presensiDate = ref(new Date().toISOString().split('T')[0])
    const presensiData = ref({})
    const kamarOptions = ref([])
    const sesiOptions = ref([])
    
    let saveTimeout = null

    const presensiStatuses = [
      { value: 'HADIR', label: 'Hadir' },
      { value: 'IZIN', label: 'Izin' },
      { value: 'SAKIT', label: 'Sakit' },
      { value: 'ALPHA', label: 'Alpha' },
    ]

    const userRole = computed(() => {
      const roles = authStore.currentUser?.roles || []
      if (roles.includes(ROLES.ASRAMA)) return ROLES.ASRAMA
      if (roles.includes(ROLES.KETUA_KAMAR)) return ROLES.KETUA_KAMAR
      return null
    })

    const isAsramaRole = computed(() => hasRole(authStore.currentUser, ROLES.ASRAMA))

    const presensiDateLong = computed(() => {
      if (!presensiDate.value) return ''
      return new Date(presensiDate.value).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long', 
        year: 'numeric'
      })
    })

    const getInitials = (name) => {
      if (!name) return '?'
      const words = name.split(' ')
      if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }

    const isStatusDisabled = (santri, statusValue) => {
        const hasActiveIzin = santri.izinSantri && santri.izinSantri.length > 0;
        
        if (hasActiveIzin) {
            // If has active permission, only IZIN is allowed (and it should be auto-selected)
            // Others are disabled
            return statusValue !== 'IZIN';
        } else {
            // If NO active permission, IZIN is disabled
            // Others are enabled
            return statusValue === 'IZIN';
        }
    }

    const getStatusButtonClass = (santriId, statusValue) => {
      const isSelected = presensiData.value[santriId] === statusValue
      
      // Default (unselected) style
      const baseStyle = "border-gray-50 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-500"

      if (!isSelected) return baseStyle

      // Selected styles
      switch(statusValue) {
        case 'HADIR':
          return "border-green-500 bg-green-500 text-white shadow-lg shadow-green-200 ring-2 ring-green-100 ring-offset-1"
        case 'IZIN':
          return "border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-200 ring-2 ring-blue-100 ring-offset-1"
        case 'SAKIT':
          return "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-200 ring-2 ring-orange-100 ring-offset-1"
        case 'ALPHA':
          return "border-red-500 bg-red-500 text-white shadow-lg shadow-red-200 ring-2 ring-red-100 ring-offset-1"
        default:
          return baseStyle
      }
    }

    const handleStatusClick = (santriId, status) => {
      // Update presensi data
      presensiData.value[santriId] = status
      
      // Trigger auto-save with debounce
      autoSave()
    }

    const autoSave = () => {
      // Clear existing timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout)
      }
      
      // Set new timeout for debounced save
      saveTimeout = setTimeout(async () => {
        await savePresensi()
      }, 800) // 800ms debounce
    }

    const savePresensi = async () => {
      // Check if we have required data
      if (!selectedSesiId.value) {
        console.log('No session selected yet')
        return
      }

      // Get filled presensi details
      const presensiDetails = Object.entries(presensiData.value)
        .filter(([_, status]) => status) // Only include filled ones
        .map(([santriId, status]) => ({
          santri_id: parseInt(santriId),
          status: status,
        }))

      // Don't save if no data filled
      if (presensiDetails.length === 0) {
        console.log('No presensi data to save')
        return
      }

      saving.value = true

      try {
        await presensiService.submitPresensi({
          tanggal: presensiDate.value,
          presensi_setting_id: parseInt(selectedSesiId.value),
          kamar_id: parseInt(isAsramaRole.value ? selectedKamarId.value : authStore.currentUser?.pengurus?.kamar_id),
          details: presensiDetails,
        })

        console.log('Presensi saved successfully')
      } catch (error) {
        console.error('Error saving presensi:', error)
        
        // Show error to user
        const errorMessage = error.message || 'Gagal menyimpan presensi'
        alert(errorMessage)
      } finally {
        saving.value = false
      }
    }

    const loadSantriByKamar = async () => {
      if (!selectedKamarId.value) return

      loading.value = true
      try {
        const response = await santriService.getSantri({
          kamar_id: selectedKamarId.value,
          limit: 100,
          check_date: presensiDate.value // Pass date to check active permissions
        })
        santriList.value = response.data?.data || []
        
        // Load existing presensi data (will also handle enforcing permissions)
        await loadExistingPresensi()
      } catch (error) {
        console.error('Error loading santri:', error)
      } finally {
        loading.value = false
      }
    }

    const loadExistingPresensi = async () => {
      // Check if we have all required parameters
      if (!presensiDate.value || !selectedSesiId.value) {
        console.log('Missing date or session, cannot load presensi')
        return
      }

      const kamarId = isAsramaRole.value ? selectedKamarId.value : authStore.currentUser?.pengurus?.kamar_id
      
      if (!kamarId) {
        console.log('No kamar selected')
        return
      }

      try {
        const response = await presensiService.getPresensi(
          presensiDate.value,
          kamarId,
          selectedSesiId.value
        )

        let mergedData = {}
        
        // If presensi data exists, load it first
        if (response.data && response.data.details) {
          response.data.details.forEach(detail => {
            mergedData[detail.santri_id] = detail.status
          })
          console.log('Loaded existing presensi data:', mergedData)
        }
        
        // Enforce Active Permissions:
        // Iterate through valid santri list and force 'IZIN' if active permission exists.
        // This ensures even if DB has 'HADIR' (error or outdated), strict permission rule applies.
        
        if (santriList.value && santriList.value.length > 0) {
            santriList.value.forEach(santri => {
                if (santri.izinSantri && santri.izinSantri.length > 0) {
                    // Force set to IZIN
                    mergedData[santri.id] = 'IZIN' 
                }
            })
        }

        // Replace with new data (clearing old statuses)
        presensiData.value = mergedData

        if (!response.data || !response.data.details) {
             console.log('No existing presensi data found, applied auto-permissions.')
        }

      } catch (error) {
        console.error('Error loading existing presensi:', error)
      }
    }

    const loadInitialData = async () => {
      loading.value = true

      try {
        // Load active presensi settings
        const sesiResponse = await presensiService.getActivePresensiSettings()
        const sesiData = sesiResponse.data?.data || []
        
        // Transform sesi data for button group
        sesiOptions.value = sesiData.map(sesi => {
            // Simplified label for the button (e.g. "Pagi", "Siang")
            const shortLabel = sesi.nama.replace('Presensi ', '')
            return {
              value: sesi.id,
              label: sesi.nama,
              shortLabel: shortLabel,
              jam: `${sesi.jam_mulai || ''} - ${sesi.jam_selesai || ''}`
            }
        })

        // Auto-select first session if available
        if (sesiOptions.value.length > 0) {
            selectedSesiId.value = sesiOptions.value[0].value
        }

        const kamarId = authStore.currentUser?.pengurus?.kamar_id

        if (isAsramaRole.value) {
          const kamarResponse = await kamarService.getKamar({ limit: 100 })
          const kamarData = kamarResponse.data?.data || []
          kamarOptions.value = kamarData.map(kamar => ({
            value: kamar.id,
            label: kamar.nama
          }))
        } else if (kamarId) {
          const response = await santriService.getSantri({
            kamar_id: kamarId,
            limit: 100,
            check_date: presensiDate.value // Pass date
          })
          santriList.value = response.data?.data || []
          
          await loadExistingPresensi()
        }
      } catch (error) {
        console.error('Error loading initial data:', error)
      } finally {
        loading.value = false
      }
    }


    onMounted(() => {
      loadInitialData()
    })

    // Watch for date changes - MUST reload santri to check permissions for new date
    watch(presensiDate, () => {
      loadSantriByKamar()
    })

    // Watch for session changes - Only need to reload attendance data
    watch(selectedSesiId, () => {
      loadExistingPresensi()
    })

    return {
      santriList,
      loading,
      saving,
      selectedKamarId,
      selectedSesiId,
      presensiDate,
      presensiData,
      presensiStatuses,
      kamarOptions,
      sesiOptions,
      isAsramaRole,
      getInitials,
      getStatusButtonClass,
      loadSantriByKamar,
      handleStatusClick,
      isStatusDisabled,
      presensiDateLong,
    }
  },
}
</script>
