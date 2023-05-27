import sourcemaps from 'rollup-plugin-sourcemaps';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' assert { type: 'json' };
import typescript from '@rollup/plugin-typescript';

const baseUmdConfig = {
  name: pkg.name,
  file: 'dist/bundle.js',
  format: 'umd',
  exports: 'named',
  sourcemap: true,
  amd: {
    id: pkg.name,
  },
};

export default {
  input: 'src/index.ts',
  output: [
    {
      ...baseUmdConfig,
      file: 'dist/bundle.js',
      plugins: [],
    },
    {
      ...baseUmdConfig,
      file: 'dist/bundle.min.js',
      plugins: [terser()],
    },
    {
      file: `dist/index.js`,
      format: 'esm',
      sourcemap: true,
      plugins: [],
    },
    {
      file: `dist/index.min.js`,
      format: 'esm',
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [
    commonjs(),
    typescript({
      outputToFilesystem: true,
    }),
    sourcemaps(),
  ],
  treeshake: true,
};
