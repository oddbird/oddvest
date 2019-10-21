const rollupBabel = require('rollup-plugin-babel');
const rollupCommonjs = require('rollup-plugin-commonjs');
const rollupResolve = require('rollup-plugin-node-resolve');

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
  input: `src/${name}.js`,
  plugins: [rollupResolve(), rollupCommonjs(), rollupBabel()],
  output: {
    file: `dist/${name}.js`,
    format: 'iife',
  },
}));
