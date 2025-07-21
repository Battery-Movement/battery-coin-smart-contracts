import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: { host: true,
            port: 3000, 
            watch: {
              usePolling: true
            },
            hmr: {
              overlay: false
            }
          },
});
