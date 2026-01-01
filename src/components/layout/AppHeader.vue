<template>
  <header class="fixed top-0 left-0 right-0 bg-primary text-white shadow-md z-50">
    <div class="flex items-center justify-between px-4 py-3">
      <!-- Back Button (if showBack is true) -->
      <button
        v-if="showBack"
        @click="handleBack"
        class="mr-3 p-2 hover:bg-primary-600 rounded-lg transition-colors touch-manipulation"
        aria-label="Back"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div class="flex-1">
        <h1 class="text-lg font-semibold truncate">{{ title }}</h1>
        <p v-if="subtitle" class="text-sm text-primary-100 truncate">{{ subtitle }}</p>
      </div>
      <button
        v-if="showLogout && !showBack"
        @click="handleLogout"
        class="ml-4 p-2 hover:bg-primary-600 rounded-lg transition-colors touch-manipulation"
        aria-label="Logout"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  </header>
</template>

<script>
import { useAuthStore } from '../../app/store/auth.store'
import { useRouter } from 'vue-router'

export default {
  name: 'AppHeader',
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: '',
    },
    showLogout: {
      type: Boolean,
      default: true,
    },
    showBack: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const handleLogout = async () => {
      if (confirm('Apakah Anda yakin ingin keluar?')) {
        authStore.logout()
        router.push('/login')
      }
    }

    const handleBack = () => {
      router.back()
    }

    return {
      handleLogout,
      handleBack,
    }
  },
}
</script>
