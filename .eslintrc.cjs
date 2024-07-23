/* eslint-env node */
module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'plugin:storybook/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint',
    'no-relative-import-paths'
  ],
  overrides: [{
    files: ['*.test.*'],
    env: {
      jest: true
    }
  }],
  'rules': {
    'arrow-body-style': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    'no-unused-vars': [0],
    'indent': ['error', 2, {'SwitchCase': 1}],
    'react/prop-types': [0],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-relative-import-paths/no-relative-import-paths': [
      'warn',
      { 'allowSameFolder': true, 'prefix': '@', 'rootDir': 'src' }
    ]
  }
};
