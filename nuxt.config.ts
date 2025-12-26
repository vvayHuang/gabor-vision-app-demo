// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  devServer: {
    host: '',
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Gabor Vision',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Enhance your visual cortex via Gabor patch contrast sensitivity training. A minimalist, Swiss-style visual training application.' },
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
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