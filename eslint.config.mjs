import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import globals from 'globals';

// Initialize FlatCompat
const compat = new FlatCompat({
  baseDirectory: import.meta.url, // Adjust if necessary
});

export default [
  js.configs.recommended,
  // Convert 'eslint-config-prettier' to flat config format
  ...compat.extends('prettier'),
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      // Your custom rules
    },
  },
  {
    ignores: ['**/dist/**'],
  },
];
