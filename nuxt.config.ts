// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  runtimeConfig: {
    public: {
      devApiUrl: process.env.DEV_API_URL,
      apiUrl: process.env.API_URL,
    }
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in', appear: true },
    head: {
      link: [
        {
          rel: 'stylesheet', href: 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'
        }
      ]
    }
  },
  pinia: {
    autoImports: [
      "defineStore",
      "acceptHMRUpdate",
      "storeToRefs"
    ]
  },
  imports: {
    dirs: ['stores']
  },
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css'
  },
})