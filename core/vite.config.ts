import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@/": `${path.resolve(__dirname, "src")}/`,
    },
  },
  build: {
    target: "esnext",
    lib: {
      entry: path.resolve(__dirname, "src/main.ts"),
      name: "library-lookup-core",
    },

    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
});
