<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <!-- Premium Profile Header -->
    <div class="relative bg-gradient-to-br from-[#104132] to-[#1e805c] rounded-b-[40px] shadow-2xl overflow-hidden z-10 transition-all duration-300">
      <!-- Decor Shapes -->
      <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl"></div>
      <div class="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-black opacity-10 blur-2xl"></div>
      
      <div class="px-6 pt-10 pb-8 relative">
        <!-- Top Bar (Title + Logout) -->
        <div class="flex justify-between items-center mb-6">
          <div>
            <p class="text-primary-100 text-[10px] font-bold tracking-wider mb-0.5 uppercase">Dashboard</p>
            <h1 class="text-lg font-bold text-white tracking-tight">Portal Pengurus</h1>
          </div>
          <button 
            @click="handleLogout"
            class="p-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-md transition-all text-white border border-white/10"
          >
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        <!-- Profile Card & Stats -->
        <div class="flex flex-col gap-4">
          <!-- Main Profile Info -->
          <div class="flex items-start gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <!-- Avatar -->
          <div class="w-12 h-12 rounded-xl bg-white shadow-lg flex items-center justify-center text-primary-800 text-base font-bold border-2 border-primary-100 shrink-0">
            {{ getUserInitials(userDisplayName) }}
          </div>
          
          <!-- Info -->
          <div class="min-w-0 flex-1">
            <h2 class="text-base font-bold text-white leading-tight mb-1 truncate">{{ userDisplayName }}</h2>
            
            <div class="flex flex-col gap-1.5">
              <!-- NIS -->
              <span v-if="userNis" class="text-[10px] text-primary-200 font-medium tracking-wide">
                NIS: {{ userNis }}
              </span>

              <!-- Tags Container (Roles + Assignments) -->
              <div class="flex flex-wrap gap-1.5">
                <!-- Roles -->
                <span 
                  v-for="role in userRoles" 
                  :key="role"
                  class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 text-primary-800 shadow-sm uppercase tracking-wide ring-1 ring-white/50"
                >
                  {{ formatRole(role) }}
                </span>

                <!-- Assignments (Kamar) -->
                <span 
                  v-if="kamarNama"
                  class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/20 text-white shadow-sm ring-1 ring-white/10 backdrop-blur-sm"
                >
                  <svg class="w-3 h-3 mr-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {{ kamarNama }}
                </span>

                <!-- Assignments (Asrama) -->
                <span 
                  v-if="asramaNama"
                  class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/20 text-white shadow-sm ring-1 ring-white/10 backdrop-blur-sm"
                >
                  <svg class="w-3 h-3 mr-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {{ asramaNama }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Main Menu -->
    <main class="px-4 py-6">
      <h3 class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">Menu Utama</h3>
      
      <div class="grid grid-cols-5 gap-2">
        <!-- Santri Button -->
        <button
          @click="$router.push('/santri')"
          class="group p-1 rounded-xl active:scale-95 transition-all duration-200 flex flex-col items-center justify-start gap-2 h-auto"
        >
          <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md border border-gray-50 flex-shrink-0 group-hover:scale-105 transition-transform">
             <svg class="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
             </svg>
          </div>
          <span class="text-gray-700 font-medium text-[10px] text-center leading-tight px-1 h-8 flex items-start justify-center">Data Santri</span>
        </button>

        <!-- Presensi Button -->
        <button
          v-if="canAccessPresensi"
          @click="$router.push('/presensi')"
          class="group p-1 rounded-xl active:scale-95 transition-all duration-200 flex flex-col items-center justify-start gap-2 h-auto"
        >
          <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md border border-gray-50 flex-shrink-0 group-hover:scale-105 transition-transform">
            <svg class="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span class="text-gray-700 font-medium text-[10px] text-center leading-tight px-1 h-8 flex items-start justify-center">Presensi</span>
        </button>

        <!-- DISABLED MENUS -->
        <!-- Izin Santri -->
        <button
          @click="$router.push('/izin-santri')"
          class="group p-1 rounded-xl active:scale-95 transition-all duration-200 flex flex-col items-center justify-start gap-2 h-auto"
        >
          <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md border border-gray-50 flex-shrink-0 group-hover:scale-105 transition-transform">
            <svg class="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span class="text-gray-700 font-medium text-[10px] text-center leading-tight px-1 h-8 flex items-start justify-center">Izin Santri</span>
        </button>

        <!-- Pelanggaran -->
        <button disabled class="group p-1 rounded-xl flex flex-col items-center justify-start gap-2 h-auto opacity-60">
          <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md border border-gray-50 flex-shrink-0">
            <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span class="text-gray-500 font-medium text-[10px] text-center leading-tight px-1 h-8 flex items-start justify-center">Pelanggaran</span>
        </button>

        <!-- Tanggungan -->
        <button disabled class="group p-1 rounded-xl flex flex-col items-center justify-start gap-2 h-auto opacity-60">
          <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md border border-gray-50 flex-shrink-0">
            <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span class="text-gray-500 font-medium text-[10px] text-center leading-tight px-1 h-8 flex items-start justify-center">Tanggungan</span>
        </button>

        <!-- Kesehatan -->
        <button disabled class="group p-1 rounded-xl flex flex-col items-center justify-start gap-2 h-auto opacity-60">
          <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md border border-gray-50 flex-shrink-0">
            <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <span class="text-gray-500 font-medium text-[10px] text-center leading-tight px-1 h-8 flex items-start justify-center">Kesehatan</span>
        </button>

        <!-- Tahfidz -->
        <button disabled class="group p-1 rounded-xl flex flex-col items-center justify-start gap-2 h-auto opacity-60">
          <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md border border-gray-50 flex-shrink-0">
            <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span class="text-gray-500 font-medium text-[10px] text-center leading-tight px-1 h-8 flex items-start justify-center">Tahfidz</span>
        </button>

        <!-- Madin -->
        <button disabled class="group p-1 rounded-xl flex flex-col items-center justify-start gap-2 h-auto opacity-60">
          <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md border border-gray-50 flex-shrink-0">
            <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span class="text-gray-500 font-medium text-[10px] text-center leading-tight px-1 h-8 flex items-start justify-center">Madin</span>
        </button>

        <!-- Informasi -->
        <button disabled class="group p-1 rounded-xl flex flex-col items-center justify-start gap-2 h-auto opacity-60">
          <div class="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md border border-gray-50 flex-shrink-0">
            <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-gray-500 font-medium text-[10px] text-center leading-tight px-1 h-8 flex items-start justify-center">Informasi</span>
        </button>
      </div>
    </main>

    <AppBottomNav />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../app/store/auth.store'
import { authService } from '../auth/auth.service'
import { canDoPresensi } from '../../utils/role'
import AppBottomNav from '../../components/layout/AppBottomNav.vue'

export default {
  name: 'DashboardPage',
  components: {
    AppBottomNav,
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    // Prefer nama_lengkap, fallback to username
    const userDisplayName = computed(() => {
      return authStore.currentUser?.nama_lengkap || authStore.currentUser?.username || 'Pengurus'
    })
    
    // Get NIS
    const userNis = computed(() => authStore.currentUser?.nis)

    const userRoles = computed(() => authStore.currentUser?.roles || [])
    
    // Get dynamic names instead of IDs
    const kamarNama = computed(() => {
        return authStore.currentUser?.pengurus?.kamar_nama || authStore.currentUser?.pengurus?.kamar_id
    })
    
    const asramaNama = computed(() => {
        return authStore.currentUser?.pengurus?.asrama_nama || authStore.currentUser?.pengurus?.asrama_id
    })
    
    const canAccessPresensi = computed(() => canDoPresensi(authStore.currentUser))

    const formatRole = (role) => {
      const roleNames = {
        PAU: 'PAU',
        KETUA_KAMAR: 'Ketua Kamar',
        ASRAMA: 'Asrama',
        KAFIL: 'Kafil',
        ASATID: 'Asatid',
        PENGURUS: 'Pengurus',
      }
      return roleNames[role] || role
    }

    const getUserInitials = (name) => {
      if (!name) return 'U'
      return name.substring(0, 2).toUpperCase()
    }

    const handleLogout = async () => {
      try {
        await authService.logout(authStore.refreshToken)
        authStore.logout()
        router.replace('/login')
      } catch (error) {
        console.error('Logout error:', error)
        // Force logout on error
        authStore.logout()
        router.replace('/login')
      }
    }

    return {
      userDisplayName,
      userNis,
      userRoles,
      kamarNama,
      asramaNama,
      canAccessPresensi,
      formatRole,
      getUserInitials,
      handleLogout,
    }
  },
}
</script>
