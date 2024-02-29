/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { readdirSync } from "fs";
import path from "path";
import tsPaths from "vite-tsconfig-paths";

const basePath = path.resolve("./src/");

const absolutePathAliases: Record<string, string> = {};

readdirSync(basePath).forEach((file) => {
  absolutePathAliases[file] = path.join(basePath, file);
});

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      ...absolutePathAliases,
    },
  },
  plugins: [react(), tsPaths({})],
});
