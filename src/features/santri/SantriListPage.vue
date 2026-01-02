<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <!-- Premium Gradient Header -->
    <div class="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 pb-24 pt-8 px-5 shadow-xl rounded-b-[2.5rem] relative overflow-hidden">
      <!-- Decorative circles -->
      <div class="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 rounded-full bg-black/10 blur-3xl pointer-events-none"></div>

      <div class="relative z-10 flex items-center justify-between mb-8">
        <button 
          @click="$router.back()" 
          class="p-2.5 rounded-xl bg-white/10 text-white backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all active:scale-95 touch-manipulation shadow-sm"
          aria-label="Kembali"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-white text-lg font-bold tracking-wide shadow-sm truncate max-w-[200px]">{{ pageTitle }}</h1>
        <div class="w-10"></div> <!-- Spacer -->
      </div>
      
      <!-- Stats / Info -->
      <div class="relative z-10 text-center text-primary-100/90 text-sm font-medium -mt-2 mb-2">
        <span v-if="loading">Memuat data...</span>
        <span v-else>{{ totalSantri }} Santri Terdaftar</span>
      </div>
    </div>

    <!-- Floating Search & Filter Control Panel -->
    <div class="px-4 -mt-16 relative z-20 space-y-4">
      <!-- Main Search Card -->
      <div class="bg-white rounded-3xl p-2 shadow-lg shadow-primary-900/5 ring-1 ring-gray-100">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama atau NIP..."
            class="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white text-gray-800 placeholder-gray-400 rounded-2xl border-0 focus:ring-2 focus:ring-primary-500 transition-all text-[15px] font-medium"
            @input="handleSearch"
          />
          <div class="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-white rounded-lg shadow-sm">
             <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
          </div>
        </div>
      </div>

      <!-- Kamar Filter (Only for ASRAMA) -->
      <div v-if="isAsramaRole" class="bg-white rounded-3xl p-1.5 shadow-md shadow-gray-200/50 ring-1 ring-gray-100 flex items-center gap-3 overflow-x-auto no-scrollbar">
         <!-- Custom Horizontal Scroll Filter -->
         <div class="flex items-center gap-2 px-2 w-full">
            <button 
               @click="setKamarFilter('')"
               class="whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all flex-shrink-0"
               :class="!selectedKamarId ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'"
            >
               Semua
            </button>
            <button 
               v-for="kamar in kamarOptions.filter(k => k.value)" 
               :key="kamar.value"
               @click="setKamarFilter(kamar.value)"
               class="whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all flex-shrink-0"
               :class="selectedKamarId === kamar.value ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'"
            >
               {{ kamar.label }}
            </button>
         </div>
      </div>
    </div>

    <!-- Main List Content -->
    <main class="px-4 mt-6">
      
      <!-- Loading State -->
      <div v-if="loading && santriList.length === 0" class="flex flex-col items-center justify-center py-20 space-y-4">
        <div class="relative">
           <div class="w-12 h-12 border-4 border-gray-100 rounded-full"></div>
           <div class="w-12 h-12 border-4 border-primary-500 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
        </div>
        <p class="text-gray-400 text-sm font-medium animate-pulse">Memuat data santri...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="santriList.length === 0" class="text-center py-16 bg-white rounded-[2rem] shadow-sm border border-dashed border-gray-200 mx-2">
        <div class="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
          <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 class="text-gray-900 font-bold text-lg mb-1">Tidak ada data</h3>
        <p class="text-gray-500 text-sm max-w-xs mx-auto text-center leading-relaxed">
           {{ searchQuery ? 'Tidak ditemukan santri dengan nama atau NIP tersebut.' : 'Belum ada data santri yang tersedia.' }}
        </p>
      </div>

      <!-- Santri List -->
      <div v-else class="space-y-3 pb-8">
        <div
          v-for="santri in santriList"
          :key="santri.id"
          @click="$router.push(`/santri/${santri.id}`)"
          class="group bg-white rounded-[1.5rem] p-4 shadow-sm hover:shadow-lg hover:shadow-primary-900/5 transition-all duration-300 border border-gray-100 cursor-pointer active:scale-[0.98] flex items-start gap-4"
        >
           <!-- Avatar -->
           <div class="relative">
             <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner ring-1 ring-black/5 group-hover:ring-primary-500/20 transition-all">
                <img 
                  v-if="santri.foto" 
                  :src="santri.foto" 
                  :alt="santri.nama"
                  class="w-full h-full object-cover"
                />
                <span v-else class="text-primary-600 font-black text-lg">
                  {{ getInitials(santri.nama) }}
                </span>
              </div>
              <!-- Status Dot (optional decoration) -->
              <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                 <div class="w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
              </div>
           </div>

            <!-- Content -->
            <div class="flex-1 min-w-0 pt-0.5">
               <div class="flex justify-between items-start">
                  <h3 class="font-bold text-gray-900 truncate text-[16px] leading-tight mb-1 group-hover:text-primary-700 transition-colors">{{ santri.nama }}</h3>
                  <svg class="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
               </div>
               
               <div class="flex flex-wrap items-center gap-2 mt-2">
                 <!-- NIP Badge -->
                 <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 group-hover:bg-primary-50 group-hover:border-primary-100 transition-colors">
                    <svg class="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .883-.393 1.627-1.016 2.122A2.99 2.99 0 0011 7.208A2.99 2.99 0 0012.984 8.122C12.393 7.627 12 6.883 12 6z" />
                    </svg>
                    <span class="text-[11px] font-bold text-gray-600 group-hover:text-primary-700 tracking-wide font-mono">{{ santri.nip || '-' }}</span>
                 </div>

                 <!-- Kamar Badge -->
                 <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100/50">
                    <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span class="text-[11px] font-bold text-indigo-600 tracking-wide">{{ getKamarSantri(santri) }}</span>
                 </div>
               </div>
            </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMore && !loading" class="pt-6 pb-2 px-2">
          <button
            @click="loadMore"
            :disabled="loadingMore"
            class="w-full py-4 bg-white border border-gray-100 text-primary-600 font-bold rounded-2xl hover:bg-gray-50 active:bg-gray-100 transition-all shadow-sm shadow-gray-200/50 disabled:opacity-70 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-3 group"
          >
             <div v-if="loadingMore" class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
             <span v-else class="group-hover:translate-y-0.5 transition-transform">Muat Lebih Banyak</span>
             <svg v-if="!loadingMore" class="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
             </svg>
          </button>
        </div>
        
        <!-- Pagination Info -->
        <p class="text-center text-[10px] font-medium text-gray-300 mt-6 mb-8 uppercase tracking-widest">
           Menampilkan {{ santriList.length }} / {{ totalSantri }}
        </p>
      </div>

    </main>

    <AppBottomNav />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { santriService } from './santri.service'
import { kamarService } from '../../services/kamar.service'
import { useAuthStore } from '../../app/store/auth.store'
import { ROLES, hasRole } from '../../utils/role'
import AppBottomNav from '../../components/layout/AppBottomNav.vue'
import BaseButton from '../../components/base/BaseButton.vue'
// BaseSelect is removed from the template, so it's removed from components too.

export default {
  name: 'SantriListPage',
  components: {
    AppBottomNav,
    BaseButton,
  },
  setup() {
    const authStore = useAuthStore()
    const santriList = ref([])
    const loading = ref(false)
    const loadingMore = ref(false)
    const searchQuery = ref('')
    const currentPage = ref(1)
    const totalSantri = ref(0)
    const totalPages = ref(0)
    const limit = ref(20)
    const selectedKamarId = ref('')
    const kamarOptions = ref([])

    let searchTimeout = null

    const hasMore = ref(false)

    // Check user role
    const isAsramaRole = computed(() => hasRole(authStore.currentUser, ROLES.ASRAMA))
    const isKetuaKamarRole = computed(() => hasRole(authStore.currentUser, ROLES.KETUA_KAMAR))

    // Get kamar info from auth store (for KETUA_KAMAR)
    const ketuaKamarId = computed(() => authStore.currentUser?.pengurus?.kamar_id)
    const kamarNama = computed(() => authStore.currentUser?.pengurus?.kamar_nama || 'Semua Kamar')
    
    // Check if ASRAMA user has filtered by kamar or is viewing all
    const activeKamarName = computed(() => {
        if (!selectedKamarId.value) return 'Semua Kamar'
        const kamar = kamarOptions.value.find(k => k.value === selectedKamarId.value)
        return kamar ? kamar.label : ''
    })

    const pageTitle = computed(() => {
      if (isKetuaKamarRole.value && kamarNama.value && kamarNama.value !== 'Semua Kamar') {
        return kamarNama.value
      }
      if (isAsramaRole.value) {
          return 'Data Santri'
      }
      return 'Data Santri'
    })

    const getInitials = (name) => {
      if (!name) return '?'
      const words = name.split(' ')
      if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }

    const getKamarSantri = (santri) => {
        // Try getting from kamarHistory (populated by backend)
        if (santri.kamarHistory && santri.kamarHistory.length > 0) {
            return santri.kamarHistory[0].kamar?.nama || 'Tanpa Kamar'
        }
        
        // Fallback for ketua_kamar view where we know the kamar
        if (isKetuaKamarRole.value) {
            return kamarNama.value
        }
        
        return 'Tanpa Kamar'
    }

    const setKamarFilter = (kamarId) => {
        selectedKamarId.value = kamarId
        handleKamarChange()
    }

    const loadSantri = async (reset = false) => {
      if (reset) {
        loading.value = true
        currentPage.value = 1
        santriList.value = []
      } else {
        loadingMore.value = true
      }

      try {
        const params = {
          page: currentPage.value,
          limit: limit.value,
          search: searchQuery.value,
        }
        
        // Role-based filtering
        if (isKetuaKamarRole.value && ketuaKamarId.value) {
          params.kamar_id = ketuaKamarId.value
        } else if (isAsramaRole.value && selectedKamarId.value) {
          params.kamar_id = selectedKamarId.value
        }
        
        const response = await santriService.getSantri(params)

        if (reset) {
          santriList.value = response.data.data || []
        } else {
          santriList.value = [...santriList.value, ...(response.data.data || [])]
        }

        totalSantri.value = response.data.total || 0
        totalPages.value = response.data.totalPages || 0
        hasMore.value = currentPage.value < totalPages.value
      } catch (error) {
        console.error('Error loading santri:', error)
      } finally {
        loading.value = false
        loadingMore.value = false
      }
    }

    const loadMore = () => {
      if (hasMore.value && !loadingMore.value) {
        currentPage.value++
        loadSantri(false)
      }
    }

    const handleSearch = () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        loadSantri(true)
      }, 500)
    }

    const handleKamarChange = () => {
      loadSantri(true)
    }

    const loadKamarOptions = async () => {
      if (!isAsramaRole.value) return
      
      try {
        const response = await kamarService.getKamar({ limit: 100 })
        const kamarData = response.data?.data || []
        
        // Options for horizontal filter
        kamarOptions.value = [
          ...kamarData.map(kamar => ({
            value: kamar.id,
            label: kamar.nama
          }))
        ]
      } catch (error) {
        console.error('Error loading kamar options:', error)
      }
    }

    onMounted(async () => {
      await loadKamarOptions()
      loadSantri(true)
    })

    return {
      santriList,
      loading,
      loadingMore,
      searchQuery,
      totalSantri,
      hasMore,
      pageTitle,
      getInitials,
      loadMore,
      handleSearch,
      isAsramaRole,
      selectedKamarId,
      kamarOptions,
      handleKamarChange,
      getKamarSantri,
      activeKamarName,
      setKamarFilter
    }
  },
}
</script>
