import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const banner = `/*!
 * Widget v${process.env.npm_package_version || '1.0.0'}
 * Floating video player with Amazon IVS support
 * Released under the MIT License
 */`;

const commonPlugins = [
  resolve(),
  commonjs(),
];

const terserOptions = {
  compress: {
    drop_console: false,
    drop_debugger: true,
  },
  format: {
    comments: /^!/,  // Сохраняем banner комментарий
  },
};

export default [
  // UMD build (development)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/streamslice.js',
      format: 'umd',
      name: 'StreamSlice',
      exports: 'named',
      sourcemap: true,
      banner,
      globals: {
        'amazon-ivs-player': 'IVSPlayer'
      }
    },
    external: ['amazon-ivs-player'],
    plugins: [
      ...commonPlugins,
      typescript({ tsconfig: './tsconfig.json' }),
    ]
  },

  // UMD build (minified production)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/streamslice.min.js',
      format: 'umd',
      name: 'StreamSlice',
      exports: 'named',
      sourcemap: true,
      banner,
      globals: {
        'amazon-ivs-player': 'IVSPlayer'
      }
    },
    external: ['amazon-ivs-player'],
    plugins: [
      ...commonPlugins,
      typescript({ tsconfig: './tsconfig.json' }),
      terser(terserOptions),
    ]
  },

  // ESM build (development)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/streamslice.esm.js',
      format: 'esm',
      sourcemap: true,
      banner,
    },
    external: ['amazon-ivs-player'],
    plugins: [
      ...commonPlugins,
      typescript({ tsconfig: './tsconfig.json' }),
    ]
  },

  // ESM build (minified production)
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/streamslice.esm.min.js',
      format: 'esm',
      sourcemap: true,
      banner,
    },
    external: ['amazon-ivs-player'],
    plugins: [
      ...commonPlugins,
      typescript({ tsconfig: './tsconfig.json' }),
      terser(terserOptions),
    ]
  },
];
