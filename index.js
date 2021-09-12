/* eslint-disable global-require, no-eval */

let node;

try {
  node = process.versions.node && eval('require')('./build/node');
} catch (error) {
  // NOOP
}

module.exports = node || require('./build/web');
