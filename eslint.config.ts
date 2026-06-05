import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  // formerly .eslintignore + ignorePatterns
  globalIgnores([
    'dist/',
    'types/',
    'docs/',
    'demo/',
    'coverage/',
    'storybook-static/',
    '.storybook/'
  ]),
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat.recommended,
  storybook.configs['flat/recommended'],
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'no-relative-import-paths': noRelativeImportPaths
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      'arrow-body-style': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/display-name': 'off',
      'no-unused-vars': 'off',
      'react/prop-types': 'off',
      'no-relative-import-paths/no-relative-import-paths': [
        'warn',
        { allowSameFolder: true, prefix: '@', rootDir: 'src' }
      ],
      // react-hooks v7 enables the React Compiler rules by default; the
      // patterns they flag here predate the upgrade — surfaced as warnings
      // until the code is refactored
      'react-hooks/error-boundaries': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn'
    }
  },
  {
    // tsc reports undefined identifiers itself; no-undef false-positives on
    // TS type references and ambient globals
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: {
      'no-undef': 'off'
    }
  },
  {
    files: ['**/*.{test,spec}.*'],
    languageOptions: {
      globals: { ...globals.vitest }
    }
  },
  // must stay last — disables all formatting rules in favor of Prettier
  prettier
]);
