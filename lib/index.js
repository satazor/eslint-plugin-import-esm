'use strict';

const { name, version } = require('../package.json');

const plugin = {
  meta: { name, version },
  configs: {},
  rules: {
    'explicit-extension': require('./rules/explicit-extension')
  }
};

Object.assign(plugin.configs, {
  recommended: [
    {
      plugins: {
        'import-esm': plugin
      },
      rules: {
        'import-esm/explicit-extension': 'error'
      }
    }
  ]
});

module.exports = plugin;
