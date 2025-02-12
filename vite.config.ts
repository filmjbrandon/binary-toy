// ensure 'test' is recognized in the config
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    setupFiles: './test/vitest-setup.ts',
    globals: true,
    environment: 'jsdom',
    // TODO: remove include prop after complete Vitest migration
    include: ['test/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    coverage: {
      reporter: ['lcov', 'text'],
    },
    css: true, // processes CSS files which by default it will not
    outputFile: 'test/coverage/sonar-report.xml',
  },
})
