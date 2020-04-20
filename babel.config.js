module.exports = {
  presets: [
    ['@babel/env', { targets: '> 0.25%' }],
    '@babel/react',
  ],
  plugins: [
    ['@dr.pogodin/css-modules-transform', { extensions: ['.css', '.scss'] }],
  ],
};
