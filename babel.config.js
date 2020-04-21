module.exports = {
  presets: [
    ['@babel/env', { targets: 'defaults' }],
    '@babel/react',
  ],
  plugins: [
    ['@dr.pogodin/css-modules-transform', { extensions: ['.css', '.scss'] }],
  ],
};
