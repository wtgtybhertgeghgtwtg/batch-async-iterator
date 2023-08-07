import {defineConfig} from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['source/index.ts'],
  format: ['cjs', 'esm'],
  outDir: 'build',
  sourcemap: true,
});
