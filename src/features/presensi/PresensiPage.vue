<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <!-- Premium Gradient Header -->
    <div class="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 pb-28 pt-8 px-5 shadow-xl rounded-b-[2.5rem] relative overflow-hidden">
      <!-- Decorative circles -->
      <div class="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-black/10 blur-3xl pointer-events-none"></div>

      <div class="relative z-10 flex items-center justify-between mb-6">
        <button 
          @click="$router.back()" 
          class="p-2.5 rounded-xl bg-white/10 text-white backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all active:scale-95 touch-manipulation shadow-sm"
          aria-label="Kembali"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-white text-lg font-bold tracking-wide shadow-sm">Presensi Santri</h1>
        <div class="w-10"></div> <!-- Spacer -->
      </div>
      
      <!-- Date Display -->
      <div class="relative z-10 text-center -mt-2">
        <p class="text-white/80 text-xs font-medium uppercase tracking-widest mb-1">Hari Ini</p>
        <h2 class="text-2xl font-bold text-white tracking-tight">{{ presensiDateLong || 'Pilih Tanggal' }}</h2>
      </div>
    </div>

    <!-- Floating Interface Container -->
    <div class="px-4 -mt-20 relative z-20 max-w-lg mx-auto space-y-5">
      
      <!-- Controls Card (Date & Session) -->
      <div class="bg-white rounded-[2rem] shadow-lg shadow-gray-200/50 p-5 ring-1 ring-gray-100">
        <!-- Date Picker -->
        <div class="mb-5">
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 ml-1">
             Tanggal Presensi
          </label>
          <div class="relative group">
            <input
              v-model="presensiDate"
              type="date"
              class="w-full bg-gray-50 hover:bg-white border-transparent text-gray-900 text-base font-bold rounded-2xl ring-1 ring-gray-200 focus:ring-2 focus:ring-primary-500 block p-4 pr-12 appearance-none outline-none transition-all shadow-sm"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-primary-500 group-hover:scale-110 transition-transform">
               <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
            </div>
          </div>
        </div>

        <!-- Session Selection -->
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2.5 ml-1">
            Pilih Sesi
          </label>
          <div class="grid grid-cols-3 gap-2 p-1.5 bg-gray-100/80 rounded-2xl">
            <button
              v-for="sesi in sesiOptions"
              :key="sesi.value"
              @click="selectedSesiId = sesi.value"
              class="py-3 px-2 text-sm font-bold rounded-xl transition-all duration-300 relative overflow-hidden"
              :class="selectedSesiId === sesi.value 
                ? 'bg-white text-primary-600 shadow-sm ring-1 ring-black/5' 
                : 'text-gray-400 hover:text-gray-600'"
            >
              {{ sesi.shortLabel || sesi.label }}
            </button>
            <div v-if="sesiOptions.length === 0" class="col-span-3 text-center text-xs text-gray-400 py-2">
              Tidak ada sesi aktif
            </div>
          </div>
        </div>

        <!-- Kamar Selector (ASRAMA Exclusive) - Integrated -->
        <div v-if="isAsramaRole" class="mt-6 pt-5 border-t border-gray-100">
           <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 ml-1">Filter Kamar</label>
           <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
               <button 
                  v-for="kamar in kamarOptions" 
                  :key="kamar.value"
                  @click="selectKamar(kamar.value)"
                  class="whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex-shrink-0 border"
                  :class="selectedKamarId === kamar.value 
                     ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/30' 
                     : 'bg-white text-gray-600 border-gray-200 hover:border-primary-200 hover:bg-gray-50'"
               >
                  {{ kamar.label }}
               </button>
               <div v-if="kamarOptions.length === 0" class="text-sm text-gray-400 italic">
                  Memuat kamar...
               </div>
           </div>
        </div>

      </div>

      <!-- List Header & Stats -->
      <div class="flex items-center justify-between px-2 pt-2">
        <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
           Daftar Santri
           <span v-if="isAsramaRole && !selectedKamarId" class="text-xs font-normal text-red-500 bg-red-50 px-2 py-0.5 rounded-full animate-pulse">*Pilih kamar dulu</span>
        </h2>
        <span v-if="santriList.length > 0" class="bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
          {{ santriList.length }} Santri
        </span>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col justify-center items-center py-12 text-gray-400">
        <div class="relative">
           <div class="w-12 h-12 border-4 border-gray-100 rounded-full"></div>
           <div class="w-12 h-12 border-4 border-primary-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
        </div>
        <span class="text-sm font-medium mt-3 animate-pulse">Sedang memuat data...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="santriList.length === 0" class="text-center py-16 bg-white rounded-[2rem] border border-dashed border-gray-200 mx-1">
        <div class="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow text-gray-300">
           <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
           </svg>
        </div>
        <p class="text-gray-900 font-bold mb-1">Belum ada data</p>
        <p class="text-gray-400 text-sm max-w-[200px] mx-auto">
          {{ isAsramaRole && !selectedKamarId ? 'Silakan pilih kamar di atas untuk melihat santri.' : 'Tidak ada santri terdaftar di kamar ini.' }}
        </p>
      </div>

      <!-- Main Santri List -->
      <div v-else class="space-y-4 pb-8">
        <div
          v-for="santri in santriList"
          :key="santri.id"
          class="bg-white rounded-[2rem] p-5 shadow-sm hover:shadow-lg hover:shadow-gray-200/50 transition-all border border-gray-100/80"
        >
          <!-- Santri Info Header -->
          <div class="flex items-center gap-4 mb-5 pb-4 border-b border-gray-50">
             <div class="relative flex-shrink-0">
                <div class="w-14 h-14 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 shadow-inner">
                   <img v-if="santri.foto" :src="santri.foto" class="w-full h-full object-cover" />
                   <span v-else class="text-primary-600 font-bold text-lg">{{ getInitials(santri.nama) }}</span>
                </div>
                <!-- Status Badge (Green Check) -->
                <transition 
                   enter-active-class="transform duration-200 ease-out" 
                   enter-from-class="scale-0 opacity-0" 
                   enter-to-class="scale-100 opacity-100"
                   leave-active-class="transform duration-150 ease-in" 
                   leave-from-class="scale-100 opacity-100" 
                   leave-to-class="scale-0 opacity-0"
                >
                    <div 
                      v-if="presensiData[santri.id]" 
                      class="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white text-white shadow-sm ring-1 ring-green-100"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                </transition>
             </div>
             
             <div class="flex-1 min-w-0">
               <h3 class="font-bold text-gray-900 truncate text-[16px] leading-tight mb-1">{{ santri.nama }}</h3>
               <div class="flex items-center gap-2">
                   <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 tracking-wide uppercase">
                     NIS {{ santri.nis || '-' }}
                   </span>
               </div>
             </div>
          </div>

           <!-- Status Selection Grid -->
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="status in presensiStatuses"
              :key="status.value"
              @click="handleStatusClick(santri.id, status.value)"
              :disabled="saving || isStatusDisabled(santri, status.value)"
              class="relative group flex flex-col items-center justify-center py-3 rounded-2xl transition-all duration-200 border"
              :class="getStatusButtonClass(santri.id, status.value)"
            > 
              <span class="text-lg font-black mb-0.5 relative z-10 tracking-tighter">{{ status.value[0] }}</span>
              <span class="text-[10px] font-bold relative z-10 opacity-90">{{ status.label }}</span>
            </button>
          </div>

          <!-- Saving/Message indicator -->
          <div v-if="saving" class="mt-3 flex items-center justify-center gap-2 text-[10px] font-medium text-primary-600 bg-primary-50 py-1 rounded-lg animate-pulse">
            <div class="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            <span>Menyimpan otomatis...</span>
          </div>
        </div>
      </div>
      
      <!-- Bottom padding -->
      <div class="h-8"></div>
    </div>

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

    const getStatusFromPermit = (izinSantri) => {
        if (!izinSantri || izinSantri.length === 0) return null
        const activePermit = izinSantri[0]
        const jenisIzinNama = activePermit.jenisIzin?.nama?.toUpperCase()
        return jenisIzinNama === 'SAKIT' ? 'SAKIT' : 'IZIN'
    }

    const isStatusDisabled = (santri, statusValue) => {
        const hasActiveIzin = santri.izinSantri && santri.izinSantri.length > 0
        if (hasActiveIzin) {
            const allowedStatus = getStatusFromPermit(santri.izinSantri)
            return statusValue !== allowedStatus
        } else {
            return statusValue === 'IZIN' || statusValue === 'SAKIT'
        }
    }

    const getStatusButtonClass = (santriId, statusValue) => {
      const isSelected = presensiData.value[santriId] === statusValue
      
      // Default (unselected) style with simplified border
      const baseStyle = "border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 shadow-sm"

      if (!isSelected) return baseStyle

      // Selected styles with more pop
      switch(statusValue) {
        case 'HADIR':
          return "border-green-500 bg-green-500 text-white shadow-md shadow-green-500/30 ring-2 ring-green-100 ring-offset-2 transform scale-[1.02]"
        case 'IZIN':
          return "border-blue-500 bg-blue-500 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-100 ring-offset-2 transform scale-[1.02]"
        case 'SAKIT':
          return "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/30 ring-2 ring-orange-100 ring-offset-2 transform scale-[1.02]"
        case 'ALPHA':
          return "border-red-500 bg-red-500 text-white shadow-md shadow-red-500/30 ring-2 ring-red-100 ring-offset-2 transform scale-[1.02]"
        default:
          return baseStyle
      }
    }

    const handleStatusClick = (santriId, status) => {
      presensiData.value[santriId] = status
      autoSave()
    }
    
    // New method for chip selection
    const selectKamar = (kamarId) => {
        selectedKamarId.value = kamarId
        // Triggers watch -> loadSantriByKamar logic
        // But since we removed @update:modelValue, we should call it manually or rely on watch
        // Actually, let's keep it simple and just rely on the existing loadSantriByKamar being called
        loadSantriByKamar()
    }

    const autoSave = () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout)
      }
      saveTimeout = setTimeout(async () => {
        await savePresensi()
      }, 800)
    }

    const savePresensi = async () => {
      if (!selectedSesiId.value) return

      const presensiDetails = Object.entries(presensiData.value)
        .filter(([_, status]) => status)
        .map(([santriId, status]) => ({
          santri_id: parseInt(santriId),
          status: status,
        }))

      if (presensiDetails.length === 0) return

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
      } finally {
        saving.value = false
      }
    }

    const loadSantriByKamar = async () => {
      const kamarId = isAsramaRole.value ? selectedKamarId.value : authStore.currentUser?.pengurus?.kamar_id
      if (!kamarId) return

      loading.value = true
      try {
        const response = await santriService.getSantri({
          kamar_id: kamarId,
          limit: 100,
          check_date: presensiDate.value 
        })
        santriList.value = response.data?.data || []
        await loadExistingPresensi()
      } catch (error) {
        console.error('Error loading santri:', error)
      } finally {
        loading.value = false
      }
    }

    const loadExistingPresensi = async () => {
      if (!presensiDate.value || !selectedSesiId.value) return

      const kamarId = isAsramaRole.value ? selectedKamarId.value : authStore.currentUser?.pengurus?.kamar_id
      if (!kamarId) return

      try {
        const response = await presensiService.getPresensi(
          presensiDate.value,
          kamarId,
          selectedSesiId.value
        )

        let mergedData = {}
        
        if (response.data && response.data.details) {
          response.data.details.forEach(detail => {
            mergedData[detail.santri_id] = detail.status
          })
        }
        
        if (santriList.value && santriList.value.length > 0) {
            santriList.value.forEach(santri => {
                if (santri.izinSantri && santri.izinSantri.length > 0) {
                    const status = getStatusFromPermit(santri.izinSantri)
                    mergedData[santri.id] = status
                }
            })
        }

        presensiData.value = mergedData

        const hasAutoSelections = santriList.value?.some(santri => 
            santri.izinSantri && santri.izinSantri.length > 0
        )
        
        if (hasAutoSelections) {
            setTimeout(() => {
                savePresensi()
            }, 500)
        }

      } catch (error) {
        console.error('Error loading existing presensi:', error)
      }
    }

    const loadInitialData = async () => {
      loading.value = true

      try {
        const sesiResponse = await presensiService.getActivePresensiSettings()
        const sesiData = sesiResponse.data?.data || []
        
        sesiOptions.value = sesiData.map(sesi => {
            const shortLabel = sesi.nama.replace('Presensi ', '')
            return {
              value: sesi.id,
              label: sesi.nama,
              shortLabel: shortLabel,
              jam: `${sesi.jam_mulai || ''} - ${sesi.jam_selesai || ''}`
            }
        })

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
          
          // Auto-select first kamar if available
          if (kamarOptions.value.length > 0) {
             selectedKamarId.value = kamarOptions.value[0].value
             await loadSantriByKamar()
          }
        } else if (kamarId) {
          const response = await santriService.getSantri({
            kamar_id: kamarId,
            limit: 100,
            check_date: presensiDate.value 
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

    watch(presensiDate, () => {
      loadSantriByKamar()
    })

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
      selectKamar,
    }
  },
}
</script>
