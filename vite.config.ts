import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // Cambia el valor de base dependiendo del nombre del repositorio
  base: "/react-vite-shadcn-ui-template/", // Ejemplo: "/react-vite-shadcn-ui-template/" o "/" si es DarinelGuillen.github.io
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"), // Atajo para facilitar los imports
    },
  },
  build: {
    outDir: "dist", // Carpeta donde se generarán los archivos estáticos
    sourcemap: true, // Opcional: Incluye mapas de fuente para facilitar la depuración
  },
});
