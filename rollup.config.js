const rollupBabel = require('rollup-plugin-babel');
const rollupCommonjs = require('rollup-plugin-commonjs');
const rollupResolve = require('rollup-plugin-node-resolve');
const rollupTerser = require('rollup-plugin-terser').terser;
const rollupTypescript = require('rollup-plugin-typescript');

const modules = [
  'auth',
  'auth_success',
  'client',
  'enable',
  'report',
  'set_task',
  'settings',
];

module.exports = modules.map((name) => ({
  input: `src/${name}.ts`,
  plugins: [
    rollupResolve(),
    rollupCommonjs(),
    rollupTypescript(),
    rollupBabel({
      extensions: ['.js', '.ts'],
    }),
    rollupTerser(),
  ],
  output: {
    file: `dist/${name}.js`,
    format: 'iife',
    name,
    sourcemap: true,
  },
}));
