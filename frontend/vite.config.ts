/// <reference types="vite/client" />

import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  build: {
    outDir: "build",
  },
  resolve: {
    alias: {
      $assets: resolve("./src/assets"),
      $characters: resolve("./src/characters"),
      $common: resolve("./src/common"),
      "$common-ui": resolve("./src/common-ui"),
      $config: resolve("./src/config"),
      $networking: resolve("./src/networking"),
      $scene: resolve("./src/scene"),
      $types: resolve("./src/types"),
      $utils: resolve("./src/utils"),
    },
  },
  plugins: [tsconfigPaths()],
});
