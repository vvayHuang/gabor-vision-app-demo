<template>
  <div class="min-h-screen bg-[#0F1115] text-white flex flex-col items-center justify-center p-4">
    <div class="max-w-md w-full text-center space-y-8">
      <!-- Error Code -->
      <h1 class="text-[120px] leading-none font-bold tracking-tighter text-[#FF3B30] font-mono">
        {{ error?.statusCode }}
      </h1>

      <!-- Error Message -->
      <div class="space-y-2">
        <h2 class="text-xl font-bold uppercase tracking-widest border-b-[0.5px] border-[#333] pb-2">
          {{ error?.statusCode === 404 ? 'Page Not Found' : 'System Error' }}
        </h2>
        <p class="text-[#888] font-mono text-sm pt-2">
          {{ error?.message || 'An unexpected error occurred.' }}
        </p>
      </div>

      <!-- Action Button -->
      <button @click="handleError"
        class="group relative inline-flex items-center justify-center px-8 py-3 w-full border-[0.5px] border-[#333] hover:border-[#FF3B30] hover:bg-[#FF3B30]/10 transition-colors duration-300">
        <span class="font-mono text-sm tracking-widest uppercase group-hover:text-[#FF3B30]">
          Return to Grid
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

// Nuxt 自動傳入 error prop
const props = defineProps({
  error: Object as () => NuxtError
})

// 清除錯誤狀態並導回首頁
const handleError = () => clearError({ redirect: '/' })


</script>
