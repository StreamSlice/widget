import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default [
  // UMD build for browsers
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/streamslice.js',
      format: 'umd',
      name: 'StreamSlice',
      exports: 'named',
      sourcemap: true,
      globals: {
        'amazon-ivs-player': 'IVSPlayer'
      }
    },
    external: ['amazon-ivs-player'],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      production && terser()
    ]
  },
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/streamslice.esm.js',
      format: 'esm',
      sourcemap: true
    },
    external: ['amazon-ivs-player'],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' })
    ]
  }
];
