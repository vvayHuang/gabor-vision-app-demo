// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0'
  },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/motion/nuxt', '@vite-pwa/nuxt'],
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Gabor Vision',
      short_name: 'Gabor',
      theme_color: '#1A1A1B',
      background_color: '#1A1A1B',
      display: 'standalone',
      orientation: 'portrait',
    }
  },
  css: ['~/assets/css/main.css'],
})
