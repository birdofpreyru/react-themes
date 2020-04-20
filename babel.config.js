module.exports = {
  presets: [
    ['@babel/env', { targets: '> 0.25%' }],
    '@babel/react',
  ],
  plugins: [
    ['css-modules-transform', { extensions: ['.css', '.scss'] }],
  ],
};
