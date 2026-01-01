<template>
  <div class="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
    <!-- Main Nav Container -->
    <nav class="bg-white rounded-t-[32px] shadow-[0_-5px_20px_rgba(0,0,0,0.08)] border-t border-gray-100 pb-safe pointer-events-auto relative">
      <div class="flex items-center justify-between px-10 h-16">
        <!-- Profile (Left) -->
        <router-link 
          to="/profile" 
          class="flex flex-col items-center justify-center w-12 group active:scale-95 transition-transform"
          :class="isActive('/profile') ? 'text-primary' : 'text-gray-400 hover:text-gray-600'"
        >
          <svg class="w-6 h-6 mb-0.5" :class="isActive('/profile') ? 'fill-current' : 'fill-none stroke-current'" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span class="text-[9px] font-bold tracking-wide">Profile</span>
        </router-link>

        <!-- Home (Center - Floating - Absolute Center) -->
        <div class="absolute left-1/2 -translate-x-1/2 -top-6">
          <router-link 
            to="/dashboard"
            class="w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center border-4 border-white transform transition-transform active:scale-90"
          >
             <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
             </svg>
          </router-link>
        </div>

        <!-- Logout (Right) -->
        <button 
          @click="handleLogout"
          class="flex flex-col items-center justify-center w-12 text-gray-400 hover:text-red-500 transition-colors group active:scale-95"
        >
          <svg class="w-6 h-6 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span class="text-[9px] font-bold tracking-wide group-hover:text-red-500">Logout</span>
        </button>
      </div>
    </nav>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../app/store/auth.store'
import { authService } from '../../features/auth/auth.service'

export default {
  name: 'AppBottomNav',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()

    const isActive = (path) => {
      // Simple exact match or starts with for nested routes if needed
      return route.path === path
    }

    const handleLogout = async () => {
        if (!confirm('Apakah anda yakin ingin keluar sistem?')) return

        try {
            await authService.logout(authStore.refreshToken)
            authStore.logout()
            router.replace('/login')
        } catch (error) {
            console.error('Logout error:', error)
            // Force logout
            authStore.logout()
            router.replace('/login')
        }
    }

    return {
      isActive,
      handleLogout
    }
  },
}
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
