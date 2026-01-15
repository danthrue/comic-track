import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/index.html'),
        sidepanel: resolve(__dirname, 'src/sidepanel.html'),
        background: resolve(__dirname, 'src/background/background.js'),
        content: resolve(__dirname, 'src/content/content.jsx'),
        gpa: resolve(__dirname, 'src/content/gpa.js'),
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (['background', 'content', 'gpa'].includes(chunkInfo.name)) {
            return '[name].js';
          }
          return 'assets/[name].js';
        },
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
});
