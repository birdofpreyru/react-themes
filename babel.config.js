export default {
  plugins: [
    'babel-plugin-react-compiler',
    ['@dr.pogodin/react-css-modules', {
      filetypes: {
        '.scss': { syntax: 'postcss-scss' },
      },
      generateScopedName: '[name]__[local]___[hash:base64:5]',
      replaceImport: true,
    }],
    ['module-resolver', {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      root: ['./src', '.'],
    }],
  ],
  presets: [
    '@babel/env',
    '@babel/react',
    '@babel/typescript',
  ],
};
