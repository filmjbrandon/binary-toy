import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
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
    outputFile: 'test/coverage/sonar-report.xml',
  },
})
