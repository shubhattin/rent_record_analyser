import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: true, // Enable server-side rendering
  css: ['~/assets/css/tailwind.css'],
  modules: ['@nuxt/icon', 'shadcn-nuxt', '@nuxtjs/color-mode', '@nuxt/fonts'],
  fonts: {
    families: [
      {
        name: 'Roboto',
        provider: 'google',
        weights: ['300', '400', '500', '700'],
        styles: ['normal'],
        subsets: ['latin']
      }
    ]
  },
  vite: {
    plugins: [tailwindcss()]
  },
  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },
  build: {
    transpile: ['trpc-nuxt']
  },
  alias: {
    '@/*': fileURLToPath(new URL('./app/*', import.meta.url))
  },
  nitro: {
    esbuild: {
      options: {
        target: 'esnext'
      }
    }
  },
  typescript: {
    strict: true,
    typeCheck: 'build'
  }
});
