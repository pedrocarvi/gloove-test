module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": ["error", "double"],
    "max-len": ["warn", { "code": 100 }],
    "object-curly-spacing": ["error", "always"],
    "indent": ["error", 2],
    "comma-dangle": ["error", "always-multiline"],
    "arrow-parens": ["error", "always"],
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
};
