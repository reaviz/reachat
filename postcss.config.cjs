module.exports = {
  plugins: [
    require('postcss-nested'),
    require('postcss-preset-env')({ stage: 1 }),
    require('autoprefixer'),
    require('tailwindcss/nesting')('postcss-nesting'),
    require('tailwindcss'),
  ]
};