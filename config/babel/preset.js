/**
 * Creates a Babel preset config.
 * @param {object} api Babel compiler API.
 * @param {options} [options] Optional. Preset options.
 * @param {string|string[]|object} [options.targets] Optional. Targets for
 *  Babel env preset.
 * @return {object} Babel preset config.
 */
module.exports = function preset(api, options) {
  let envPreset = '@babel/env';
  if (options) envPreset = [envPreset, options];

  return {
    presets: [
      envPreset,

      // TODO: Starting from Babel 8, "automatic" will be the default runtime,
      // thus once upgraded to Babel 8, runtime should be removed from
      // @babel/react options below.
      ['@babel/react', { runtime: 'automatic' }],

      '@babel/typescript',
    ],
    plugins: [
      ['@dr.pogodin/react-css-modules', {
        filetypes: {
          '.scss': { syntax: 'postcss-scss' },
        },
        generateScopedName: '[name]__[local]___[hash:base64:5]',
        replaceImport: true,
      }],
      ['module-resolver', {
        extensions: ['.js', '.jsx'],
        root: ['./src', '.'],
      }],
      '@babel/plugin-transform-runtime',
    ],
  };
};
