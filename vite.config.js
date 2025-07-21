import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@alchemy/aa-core', '@alchemy/aa-alchemy', '@alchemy/aa-react'],
  },
  base: "./",
  resolve: {
    alias: {
      '@alchemy/aa-react': path.resolve(__dirname, 'node_modules/@alchemy/aa-react'),
      '@alchemy/aa-alchemy': path.resolve(__dirname, 'node_modules/@alchemy/aa-alchemy'),
      '@alchemy/aa-core': path.resolve(__dirname, 'node_modules/@alchemy/aa-core'),
    },
  },
  server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true
    },
    hmr: {
      overlay: false
    }
  },
});
