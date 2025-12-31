import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const repoBase = '/Vshow-Stage/'; // GitHub Pages project path

export default defineConfig({
  // Use the repo base when building in CI for GitHub Pages; keep "/" locally
  base: isGitHubActions ? repoBase : '/',
  server: {
    port: 3000,
    host: true,
  },
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei']
  }
});
