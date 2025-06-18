import { type Options, defineConfig } from "tsup";

export default defineConfig((options: Options) => ({
  entry: ["src/index.ts"],
  format: ["esm"],
  clean: true,
  minify: true,
  shims: true,
  ...options,
}));
