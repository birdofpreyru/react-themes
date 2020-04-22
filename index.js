/* eslint-disable global-require, no-eval */

module.exports = typeof process !== 'undefined'
  && process.versions && process.versions.node
  ? eval('require')('./build/node') : require('./build/web');
