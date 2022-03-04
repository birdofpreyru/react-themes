module.exports = {
  presets: [
    require.resolve('@docusaurus/core/lib/babel/preset'),
    ['@babel/react', { runtime: 'automatic' }],
  ],
};
