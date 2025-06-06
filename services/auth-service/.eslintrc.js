module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',

    indent: 'off',
    quotes: 'off',
    semi: 'off',
    'no-trailing-spaces': 'off',
    'object-curly-spacing': 'off',
    'arrow-parens': 'off',
    'comma-dangle': 'off',
    'space-before-function-paren': 'off',
    'max-len': 'off',
    'eol-last': 'off',
    'prettier/prettier': 'off',

    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/quotes': 'off',
    '@typescript-eslint/semi': 'off',
    '@typescript-eslint/no-trailing-spaces': 'off',
    '@typescript-eslint/object-curly-spacing': 'off',
    '@typescript-eslint/arrow-parens': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/max-len': 'off',
    '@typescript-eslint/eol-last': 'off',
  },
};
