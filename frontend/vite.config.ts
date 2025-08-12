/// <reference types="node" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),          // '@' points to 'frontend/src'
      '@shared': path.resolve(__dirname, '../shared'),  // adjust if you have shared folder at root
      '@assets': path.resolve(__dirname, '../attached_assets'), // adjust similarly
    },
  },
  root: path.resolve(__dirname), // root is frontend folder
  build: {
    outDir: path.resolve(__dirname, 'dist/public'), // custom build output folder
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ['**/.*'],
    },
  },
});
