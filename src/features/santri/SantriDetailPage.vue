<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <!-- Header with Gradient -->
    <div class="bg-gradient-to-br from-primary-600 to-primary-800 pb-20 pt-6 px-4 shadow-lg relative overflow-hidden">
      <div class="relative z-10 flex items-center justify-between mb-6">
        <button @click="$router.back()" class="p-2 rounded-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 transition-all">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-white text-lg font-bold tracking-wide">Detail Santri</h1>
        <div class="w-10"></div> <!-- Spacer for center alignment -->
      </div>

      <!-- Profile Overview -->
      <div v-if="santri" class="flex flex-col items-center text-center">
        <div class="relative mb-4">
          <div class="w-28 h-28 rounded-full border-4 border-white/30 shadow-xl overflow-hidden bg-white flex items-center justify-center">
             <img 
                v-if="santri.foto" 
                :src="santri.foto" 
                :alt="santri.nama"
                class="w-full h-full object-cover"
              />
              <span v-else class="text-primary-600 font-bold text-4xl">
                {{ getInitials(santri.nama) }}
              </span>
          </div>
          <div class="absolute bottom-1 right-1 bg-green-400 w-5 h-5 rounded-full border-2 border-white" title="Aktif"></div>
        </div>
        <h2 class="text-2xl font-bold text-white mb-1">{{ santri.nama }}</h2>
        <p class="text-white/80 font-medium bg-white/10 px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-white/10">
          {{ santri.nip ? `NIP: ${santri.nip}` : 'Belum ada NIP' }}
        </p>
      </div>

      <!-- Loading Placeholder -->
      <div v-else-if="loading" class="flex flex-col items-center animate-pulse">
        <div class="w-28 h-28 rounded-full bg-white/20 mb-4"></div>
        <div class="h-6 w-48 bg-white/20 rounded mb-2"></div>
        <div class="h-4 w-32 bg-white/20 rounded"></div>
      </div>
    </div>

    <!-- Main Content Area - Overlapping Header -->
    <main class="-mt-10 px-4 space-y-5 relative z-20">
      
      <!-- Error State -->
      <div v-if="error" class="bg-white rounded-2xl p-6 shadow-md text-center">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 text-red-500">
           <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
        </div>
        <p class="text-gray-800 font-medium">{{ error }}</p>
        <button @click="loadSantriDetail" class="mt-4 text-primary-600 font-semibold hover:underline">Coba Lagi</button>
      </div>

      <template v-else-if="santri">
        <!-- Personal Info Card -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center gap-3">
             <div class="p-2 bg-blue-100 text-blue-600 rounded-lg">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
             </div>
             <h3 class="font-bold text-gray-800">Informasi Pribadi</h3>
          </div>
          <div class="px-5 py-2">
            <InfoRow label="NIS" :value="santri.nis || '-'">
              <template #icon>
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"/></svg>
              </template>
            </InfoRow>
            <InfoRow label="NIK" :value="santri.nik || '-'">
               <template #icon>
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
               </template>
            </InfoRow>
            <InfoRow label="Jenis Kelamin" :value="santri.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'">
               <template #icon>
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
               </template>
            </InfoRow>
            <InfoRow label="Tempat, Tanggal Lahir" :value="`${santri.tempat_lahir || '-'}, ${formatDate(santri.tanggal_lahir)}`">
               <template #icon>
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
               </template>
            </InfoRow>
            <InfoRow label="Alamat" :value="santri.alamat || '-'" :multiline="true">
               <template #icon>
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
               </template>
            </InfoRow>
          </div>
        </section>

        <!-- Kamar / Placement Info -->
        <section v-if="currentKamar" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center gap-3">
             <div class="p-2 bg-purple-100 text-purple-600 rounded-lg">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
             </div>
             <h3 class="font-bold text-gray-800">Penempatan</h3>
          </div>
          <div class="px-5 py-2">
            <InfoRow label="Kamar" :value="currentKamar.kamar?.nama || '-'">
               <template #icon>
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
               </template>
            </InfoRow>
            <InfoRow label="Asrama" :value="currentKamar.kamar?.asrama?.nama || '-'">
               <template #icon>
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"/></svg>
               </template>
            </InfoRow>
            <InfoRow label="Tahun Ajaran" :value="currentKamar.tahun?.toString() || '-'">
               <template #icon>
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
               </template>
            </InfoRow>
          </div>
        </section>

        <!-- Family Info -->
        <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center gap-3">
             <div class="p-2 bg-orange-100 text-orange-600 rounded-lg">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
             </div>
             <h3 class="font-bold text-gray-800">Keluarga</h3>
          </div>
          <div class="px-5 py-2">
            <InfoRow label="Nama Ayah" :value="santri.nama_ayah || '-'">
               <template #icon>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
               </template>
            </InfoRow>
            <InfoRow label="No HP Ayah" :value="santri.no_hp_ayah || '-'">
               <template #icon>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
               </template>
            </InfoRow>
            <div class="border-t border-gray-50 my-1"></div>
            <InfoRow label="Nama Ibu" :value="santri.nama_ibu || '-'">
               <template #icon>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
               </template>
            </InfoRow>
            <InfoRow label="No HP Ibu" :value="santri.no_hp_ibu || '-'">
               <template #icon>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
               </template>
            </InfoRow>
            <div class="border-t border-gray-50 my-1"></div>
            <InfoRow label="Wali" :value="santri.wali || '-'">
               <template #icon>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
               </template>
            </InfoRow>
             <InfoRow label="No HP Santri" :value="santri.no_hp_santri || '-'">
               <template #icon>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
               </template>
            </InfoRow>
          </div>
        </section>

        <!-- Other Info -->
         <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center gap-3">
             <div class="p-2 bg-gray-100 text-gray-600 rounded-lg">
               <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
             </div>
             <h3 class="font-bold text-gray-800">Lainnya</h3>
          </div>
          <div class="px-5 py-2">
            <InfoRow label="Tanggal Masuk" :value="formatDate(santri.tanggal_masuk)">
               <template #icon>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
               </template>
            </InfoRow>
            <InfoRow label="Anak Ke" :value="santri.anak_ke?.toString() || '-'">
               <template #icon>
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>
               </template>
            </InfoRow>
            <InfoRow label="Jumlah Saudara" :value="santri.jumlah_saudara?.toString() || '-'">
               <template #icon>
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
               </template>
            </InfoRow>
          </div>
        </section>
      </template>

      <!-- Back Button Spacing for Mobile -->
      <div class="h-8"></div>
    </main>
    
    <AppBottomNav />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { santriService } from './santri.service'
import AppBottomNav from '../../components/layout/AppBottomNav.vue'
import InfoRow from '../../components/common/InfoRow.vue'

export default {
  name: 'SantriDetailPage',
  components: {
    AppBottomNav,
    InfoRow
  },
  setup() {
    const route = useRoute()
    const santri = ref(null)
    const loading = ref(true)
    const error = ref(null)

    const currentKamar = computed(() => {
      if (!santri.value?.kamarHistory) return null
      // Assuming kamarHistory[0] is the latest one
      return santri.value.kamarHistory[0] || null
    })

    const getInitials = (name) => {
      if (!name) return '?'
      const words = name.split(' ')
      if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase()
      }
      return name.substring(0, 2).toUpperCase()
    }

    const formatDate = (date) => {
      if (!date) return '-'
      try {
        const d = new Date(date)
        return d.toLocaleDateString('id-ID', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      } catch {
        return '-'
      }
    }

    const loadSantriDetail = async () => {
      loading.value = true
      error.value = null
      
      try {
        const id = route.params.id
        console.log('Loading details for:', id)
        const response = await santriService.getSantriById(id)
        santri.value = response.data
      } catch (err) {
        console.error('Error loading santri:', err)
        error.value = err.message || 'Gagal memuat data santri'
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      loadSantriDetail()
    })

    return {
      santri,
      loading,
      error,
      currentKamar,
      getInitials,
      formatDate,
      loadSantriDetail
    }
  }
}
</script>

<style scoped>
/* Optional: specific header overlapping behavior if needed */
</style>
