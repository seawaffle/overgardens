import { defineConfig } from 'astro/config'

export default defineConfig({
    site: 'https://seawaffle.github.io',
    base: '/overgardens',
    build: {
      assetsPrefix: './'
    },
    vite: {
      base: ''
    }
  // your configuration options here...
  // https://docs.astro.build/en/reference/configuration-reference/
})