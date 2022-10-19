module.exports = {
  extends: ['stylelint-prettier/recommended'],
  plugins: ["stylelint-prettier"],
  customSyntax: 'postcss-less',
  rules: {
    'number-max-precision': [8],
    'declaration-no-important': null,
    'no-descending-specificity': null,
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'local'] }],
    'selector-class-pattern': '^[a-zA-Z][a-zA-Z0-9_-]*$',
    'prettier/prettier': [true, { singleQuote: false }],
  },
};
