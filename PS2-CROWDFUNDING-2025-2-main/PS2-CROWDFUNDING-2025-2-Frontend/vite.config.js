import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: true,          // Escucha en todas las interfaces (importante para Docker)
    watch: {
      usePolling: true,  // Detecta cambios en volúmenes montados
    },
    hmr: {
      host: 'localhost', // IP o host de tu máquina
      port: 5173,        // Puerto que expusiste en docker-compose
    },
  },
});
