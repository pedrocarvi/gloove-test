module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    project: ["./tsconfig.json"], // Verifica que el nombre del archivo tsconfig es correcto
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "quotes": ["error", "double"],
    "max-len": ["warn", { "code": 100 }],
    "object-curly-spacing": ["error", "always"],
    "indent": ["error", 2],
    "comma-dangle": ["error", "always-multiline"],
    "arrow-parens": ["error", "always"],
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
  },
};






