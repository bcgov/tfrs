module.exports = {
  env: {
    browser: true,
    es2021: true,
    jquery: true
  },
  extends: [
    'plugin:react/recommended',
    'standard'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [
    'react'
  ],
  rules: {
    'react/prop-types': 'off',
    'react/no-children-prop': 'off'
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
