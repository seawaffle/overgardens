import { defineConfig } from 'astro/config'

export default defineConfig({
    base: '',
    build: {
      assetsPrefix: './'
    },
    vite: {
      base: ''
    }
  // your configuration options here...
  // https://docs.astro.build/en/reference/configuration-reference/
})