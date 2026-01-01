<template>
  <div id="app" class="min-h-screen">
    <!-- iOS Install Banner -->
    <div v-if="showIOSInstallBanner" class="fixed top-0 left-0 right-0 bg-primary text-white p-3 z-50 text-sm">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <p class="font-medium">Install Aplikasi</p>
          <p class="text-primary-100 text-xs mt-1">Tap <svg class="inline w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/></svg> lalu "Add to Home Screen"</p>
        </div>
        <button @click="closeIOSBanner" class="ml-2 p-2 hover:bg-primary-600 rounded">
          ✕
        </button>
      </div>
    </div>

    <router-view />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    const showIOSInstallBanner = ref(false)

    onMounted(() => {
      // Detect iOS Safari and check if not in standalone mode
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
      const isInStandaloneMode = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches
      
      if (isIOS && !isInStandaloneMode && !localStorage.getItem('iosInstallBannerClosed')) {
        showIOSInstallBanner.value = true
      }
    })

    const closeIOSBanner = () => {
      showIOSInstallBanner.value = false
      localStorage.setItem('iosInstallBannerClosed', 'true')
    }

    return {
      showIOSInstallBanner,
      closeIOSBanner,
    }
  },
}
</script>

