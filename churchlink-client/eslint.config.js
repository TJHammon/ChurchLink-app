// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        ...globals.browser, // enables fetch, window, document, console, etc.
        ...globals.node, // allows import.meta and Vite-related node globals
      },
    },
    ignores: ['dist', 'node_modules'],
    rules: {
      // keep empty for now
    },
  },
];
