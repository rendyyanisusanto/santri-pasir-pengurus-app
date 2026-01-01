<template>
  <div class="min-h-screen bg-primary-700 flex flex-col justify-end">
    <!-- Top Branding Section -->
    <div class="flex-1 flex flex-col justify-center items-center px-6 relative overflow-hidden">
      <div class="z-10 text-center mb-8">
        <img src="/1.webp" alt="Logo" class="w-32 h-32 object-contain mb-4 mx-auto" />
        <h1 class="text-3xl font-bold text-white tracking-tight mb-2">Portal Pengurus</h1>
        <p class="text-primary-100 text-sm font-medium tracking-wide opacity-90">PONDOK PESANTREN AL-ISLAM</p>
      </div>
    </div>

    <!-- Bottom Content Section -->
    <div class="bg-white rounded-t-[32px] w-full px-8 pt-10 pb-8 flex flex-col shadow-2xl relative z-20 h-[65vh]">
      <div class="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 opacity-50"></div>
      
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Selamat Datang 👋</h2>
        <p class="text-gray-500 text-sm">Masuk untuk mengelola data santri.</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6 flex-1 flex flex-col">
        <div>
          <BaseInput
            v-model="form.username"
            label="Username"
            placeholder="Contoh: ustadz_ahmad"
            autocomplete="username"
            required
            :error="errors.username"
          />
        </div>

        <div>
          <BaseInput
            v-model="form.password"
            type="password"
            label="Password"
            placeholder="••••••••"
            autocomplete="current-password"
            required
            :error="errors.password"
          />
          <!-- Forgot Password Link -->
          <div class="flex justify-end pt-2">
            <a href="#" class="text-xs font-semibold text-primary-600 hover:text-primary-800 transition-colors">
              Lupa Password?
            </a>
          </div>
        </div>

        <div v-if="errorMessage" class="p-3 bg-red-50 text-red-600 text-sm rounded-xl flex items-center gap-2 border border-red-100">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="font-medium">{{ errorMessage }}</span>
        </div>

        <div class="mt-auto pb-4">
          <BaseButton
            type="submit"
            :loading="loading"
            full-width
            size="lg"
            class="shadow-lg shadow-primary/30 h-14 text-lg font-bold rounded-xl"
          >
            {{ loading ? 'Memproses...' : 'Masuk' }}
          </BaseButton>
          
          <div class="mt-6 text-center">
             <p class="text-xs text-gray-400 font-medium">Bantuan? Hubungi Admin Pusat</p>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../app/store/auth.store'
import { authService } from './auth.service'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseButton from '../../components/base/BaseButton.vue'

export default {
  name: 'LoginPage',
  components: {
    BaseInput,
    BaseButton,
  },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()

    const form = ref({
      username: '',
      password: '',
    })

    const errors = ref({
      username: '',
      password: '',
    })

    const loading = ref(false)
    const errorMessage = ref('')

    onMounted(() => {
      // If already logged in, redirect to dashboard
      if (authStore.isAuthenticated) {
        router.push('/dashboard')
      }
    })

    const validateForm = () => {
      errors.value = {
        username: '',
        password: '',
      }

      if (!form.value.username) {
        errors.value.username = 'Username wajib diisi'
        return false
      }

      if (!form.value.password) {
        errors.value.password = 'Password wajib diisi'
        return false
      }

      return true
    }

    const handleLogin = async () => {
      errorMessage.value = ''

      if (!validateForm()) {
        return
      }

      loading.value = true

      try {
        const response = await authService.login(form.value.username, form.value.password)
        
        console.log('Login response:', response) // Debug log
        
        // Save auth data to store
        authStore.setAuth(
          response.accessToken,
          response.refreshToken,
          response.user
        )

        // Get redirect path from query or default to dashboard
        const redirectPath = router.currentRoute.value.query.redirect || '/dashboard'
        
        // Replace instead of push to prevent going back to login page
        await router.replace(redirectPath)
      } catch (error) {
        console.error('Login error:', error)
        errorMessage.value = error.message || 'Login gagal. Periksa username dan password Anda.'
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      errors,
      loading,
      errorMessage,
      handleLogin,
    }
  },
}
</script>
