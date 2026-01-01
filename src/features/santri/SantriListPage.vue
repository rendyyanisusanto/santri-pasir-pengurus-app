<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <!-- Custom Gradient Header with Search -->
    <div class="bg-gradient-to-br from-primary-600 to-primary-800 pb-20 pt-6 px-4 shadow-lg rounded-b-[2.5rem] relative z-10">
      <div class="flex items-center justify-between mb-6">
        <button 
          @click="$router.back()" 
          class="p-2 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Kembali"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-white text-xl font-bold tracking-wide shadow-sm">{{ pageTitle }}</h1>
        <div class="w-10"></div> <!-- Spacer for center alignment -->
      </div>
      
      <!-- Search Bar -->
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari nama atau NIP..."
          class="w-full px-5 py-3.5 pl-12 bg-white text-gray-800 placeholder-gray-400 rounded-2xl shadow-lg border-0 focus:ring-4 focus:ring-primary-400/30 transition-shadow text-base"
          @input="handleSearch"
        />
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <!-- Main Content -->
    <main class="px-4 -mt-8 relative z-20">
      
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary-600"></div>
        <p class="text-gray-400 text-sm font-medium animate-pulse">Memuat data santri...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="santriList.length === 0" class="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 mx-2 mt-4">
        <div class="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="text-gray-900 font-bold text-lg mb-1">Tidak ada data</h3>
        <p class="text-gray-500 text-sm max-w-xs mx-auto text-center">{{ searchQuery ? 'Tidak ada santri yang cocok dengan pencarian Anda.' : 'Belum ada data santri yang terdaftar.' }}</p>
      </div>

      <!-- Santri List -->
      <div v-else class="space-y-3 pb-8 mt-2">
        <div
          v-for="santri in santriList"
          :key="santri.id"
          @click="$router.push(`/santri/${santri.id}`)"
          class="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 cursor-pointer active:scale-[0.99] flex items-center gap-4"
        >
           <!-- Avatar -->
           <div class="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-inner relative">
              <img 
                v-if="santri.foto" 
                :src="santri.foto" 
                :alt="santri.nama"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-primary-600 font-bold text-base">
                {{ getInitials(santri.nama) }}
              </span>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
               <h3 class="font-bold text-gray-900 truncate text-[15px] mb-0.5 group-hover:text-primary-700 transition-colors">{{ santri.nama }}</h3>
               <p class="text-xs text-gray-500 truncate">
                 <span v-if="santri.nip" class="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] uppercase font-medium tracking-wide">NIP {{ santri.nip }}</span>
                 <span v-else class="italic text-gray-400">Belum ada NIP</span>
               </p>
            </div>

            <!-- Action Icon -->
            <div class="text-gray-300 group-hover:text-primary-500 transition-colors">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
               </svg>
            </div>
        </div>

        <!-- Load More Button -->
        <div v-if="hasMore && !loading" class="pt-4 pb-2">
          <button
            @click="loadMore"
            :disabled="loadingMore"
            class="w-full py-3 px-4 bg-white border border-gray-200 text-primary-600 font-semibold rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
          >
             <div v-if="loadingMore" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
             {{ loadingMore ? 'Memuat...' : 'Muat Lebih Banyak' }}
          </button>
        </div>
        
        <!-- Pagination Info -->
        <p class="text-center text-xs text-gray-400 mt-4 mb-8">
           Menampilkan {{ santriList.length }} dari {{ totalSantri }} santri
        </p>
      </div>

    </main>

    <AppBottomNav />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { santriService } from './santri.service'
import { useAuthStore } from '../../app/store/auth.store'
import AppBottomNav from '../../components/layout/AppBottomNav.vue'
import BaseButton from '../../components/base/BaseButton.vue'

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
    const limit = ref(10)

    let searchTimeout = null

    const hasMore = ref(false)

    // Get kamar info from auth store
    const kamarId = computed(() => authStore.currentUser?.pengurus?.kamar_id)
    const kamarNama = computed(() => authStore.currentUser?.pengurus?.kamar_nama || 'Semua Kamar')
    
    // Debug: Log user data on mount
    onMounted(() => {
      console.log('👤 Current User:', authStore.currentUser)
      console.log('🏠 Pengurus Data:', authStore.currentUser?.pengurus)
      console.log('🔑 Kamar ID:', kamarId.value)
      console.log('📛 Kamar Nama:', kamarNama.value)
    })
    
    const pageTitle = computed(() => {
      if (kamarNama.value && kamarNama.value !== 'Semua Kamar') {
        return `Data Santri - ${kamarNama.value}`
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
        
        // Add kamar filter if user has kamar assignment
        if (kamarId.value) {
          params.kamar_id = kamarId.value
          console.log('🔍 Filtering by kamar_id:', kamarId.value)
        } else {
          console.log('⚠️ No kamar_id found in auth store')
        }
        
        console.log('📤 API Request params:', params)
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

    onMounted(() => {
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
    }
  },
}
</script>
