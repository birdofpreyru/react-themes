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
    ],
    plugins: [
      ['@dr.pogodin/css-modules-transform', { extensions: ['.css', '.scss'] }],
      ['module-resolver', {
        extensions: ['.js', '.jsx'],
        root: ['./src', '.'],
      }],
      '@babel/plugin-transform-runtime',
    ],
  };
};
