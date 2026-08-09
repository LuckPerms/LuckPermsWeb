import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

const config = JSON.parse(
  readFileSync(new URL('./config.json', import.meta.url), 'utf-8'),
);

const gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();

export default defineConfig({
  base: config.base,
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "sass:color";
          @use "@/scss/variables" as *;
          @use "@/scss/breakpoints" as *;
        `,
      },
    },
  },
  define: {
    'process.env.VUE_APP_GIT_HASH': JSON.stringify(gitHash),
  },
  build: {
    target: 'esnext',
  },
});
