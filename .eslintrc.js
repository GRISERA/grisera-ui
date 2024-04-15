module.exports = {
  'extends': [
    'plugin:vue/recommended',
    'plugin:vue/essential',
  ],
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single', {
      avoidEscape: true,
    }],
    semi: ['error', 'always'],
    'comma-dangle': ['error', 'always-multiline', {
      functions: 'never',
    }],
    'vue/html-indent': ['error', 2, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: [],
    }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
