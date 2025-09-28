import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import stdLibBrowser from "vite-plugin-node-stdlib-browser";


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),stdLibBrowser()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      buffer: "buffer"
    },
  },
})