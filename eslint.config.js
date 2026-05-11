'use strict';

const js = require('@eslint/js');
const globals = require('globals');
const importPlugin = require('eslint-plugin-import-x');
const prettierConfig = require('eslint-config-prettier');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const tseslint = require('typescript-eslint');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  {
    ignores: [
      '.git/**',
      '.nyc_output/**',
      '.vscode/**',
      '.yarn/**',
      'coverage/**',
      'dist/**',
      'htmlcov/**',
      'jscache/**',
      'node_modules/**',
    ],
  },

  js.configs.recommended,
  importPlugin.flatConfigs.recommended,
  importPlugin.flatConfigs.typescript,
  prettierConfig,

  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    settings: {
      'import-x/extensions': ['.js', '.ts'],
      'import-x/resolver': { typescript: {} },
    },
    rules: {
      // Import
      'import-x/order': [1, { 'newlines-between': 'always' }],
      'import-x/named': 1,

      'no-warning-comments': [1, { terms: ['todo', 'fixme', '@@@'] }],
    },
  },

  // src/**/*.ts: TypeScript browser code
  {
    files: ['src/**/*.ts'],
    extends: [...tseslint.configs.recommended, ...tseslint.configs.stylistic],
    languageOptions: {
      globals: { ...globals.browser, TrelloPowerUp: 'readonly' },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/explicit-function-return-type': 0,

      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { fixStyle: 'inline-type-imports' },
      ],

      'simple-import-sort/imports': 1,
      'import-x/order': 0,
    },
  },

  // test/**/*.js: Jest tests in jsdom
  {
    files: ['test/**/*.js'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.jest,
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 1,
      'import-x/order': 0,
      'global-require': 0,
    },
  },
]);
