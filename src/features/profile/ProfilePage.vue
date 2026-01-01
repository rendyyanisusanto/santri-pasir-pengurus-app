<template>
  <div class="min-h-screen bg-gray-50 pb-24">
    <div class="bg-white px-6 py-8 rounded-b-[40px] shadow-sm mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Profile Saya</h1>
      <p class="text-gray-500">Informasi akun pengurus anda.</p>
    </div>
    
    <div class="px-6">
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div class="text-center mb-6">
            <div class="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3">
                {{ userInitials }}
            </div>
            <h2 class="text-lg font-bold text-gray-900">{{ userName }}</h2>
            <p class="text-gray-500 text-sm">NIS: {{ userNis }}</p>
        </div>
        
        <div class="border-t border-gray-100 pt-4">
             <div class="flex justify-between py-3 border-b border-gray-50">
                 <span class="text-gray-500 text-sm">Username</span>
                 <span class="font-medium text-gray-900 text-sm">{{ username }}</span>
             </div>
        </div>
      </div>
    </div>

    <!-- Bottom Nav will be here via App.vue or layout -->
    <AppBottomNav />
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '../../app/store/auth.store'
import AppBottomNav from '../../components/layout/AppBottomNav.vue'

export default {
  name: 'ProfilePage',
  components: { AppBottomNav },
  setup() {
    const authStore = useAuthStore()
    
    const userName = computed(() => authStore.currentUser?.nama_lengkap || 'Pengurus')
    const username = computed(() => authStore.currentUser?.username)
    const userNis = computed(() => authStore.currentUser?.nis || '-')
    const userInitials = computed(() => {
        const name = userName.value
        return name ? name.substring(0, 2).toUpperCase() : 'U'
    })

    return {
      userName,
      username,
      userNis,
      userInitials
    }
  }
}
</script>
