import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['test/**/*.jsx'],
    coverage: {
      provider: 'c8', 
      reporter: ['text', 'html'],
      all: true, 
    },
  },
});
