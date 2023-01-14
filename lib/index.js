'use strict';

module.exports = {
  rules: {
    'explicit-extension': require('./rules/explicit-extension')
  },
  configs: {
    recommended: {
      plugins: ['import-esm'],
      rules: {
        'import-esm/explicit-extension': 'error'
      }
    },
  },
};
