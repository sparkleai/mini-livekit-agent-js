module.exports = {
  extends: [
    'standard-with-typescript',
    'prettier'
  ],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname
  },
  rules: {}
} 