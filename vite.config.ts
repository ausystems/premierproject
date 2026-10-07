import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  // The build-time renderer (src/entry-server.tsx) bundles its dependencies, so Node never has to
  // resolve browser-oriented packages on its own.
  ssr: { noExternal: true },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
