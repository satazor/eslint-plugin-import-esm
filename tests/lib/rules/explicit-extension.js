'use strict';

const path = require('path');
const rule = require('../../../lib/rules/explicit-extension');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
});

ruleTester.run('explicit-extension', rule, {
  valid: [
    {
      name: 'import relative file with extension',
      code: `import foo from './foo.js';`,
      filename: __filename,
    },
  ],

  invalid: [
    {
      name: 'import relative file without extension',
      code: `import foo from './foo';`,
      output: `import foo from './foo.js';`,
      filename: __filename,
      errors: [{ message: 'Missing extension on the import path', type: 'Literal' }],
    },
    {
      name: 'import relative file without extension, starting with ../',
      code: `import foo from '../test/lib/rules/foo';`,
      output: `import foo from '../test/lib/rules/foo.js';`,
      filename: path.resolve('./tests'),
      errors: [{ message: 'Missing extension on the import path', type: 'Literal' }],
    },
    {
      name: 'import relative directory without extension',
      code: `import lib from './lib';`,
      output: `import lib from './lib/index.js';`,
      filename: path.resolve('./foo.js'),
      errors: [{ message: 'Missing extension on the import path', type: 'Literal' }],
    },
    {
      name: 'import relative directory without extension, starting with ../',
      code: `import lib from '../lib';`,
      output: `import lib from '../lib/index.js';`,
      filename: path.resolve('./tests/foo.js'),
      errors: [{ message: 'Missing extension on the import path', type: 'Literal' }],
    },
    {
      name: 'not fixable if there is no source file name',
      code: `import foo from './foo';`,
      output: null,
      errors: [{ message: 'Missing extension on the import path', type: 'Literal' }],
    },
    {
      name: 'dynamic import relative file without extension',
      code: `import('./foo');`,
      output: `import('./foo.js');`,
      filename: __filename,
      errors: [{ message: 'Missing extension on the import path', type: 'Literal' }],
    },
    {
      name: 'dynamic import relative directory without extension',
      code: `import('./lib');`,
      output: `import('./lib/index.js');`,
      filename: path.resolve('./foo.js'),
      errors: [{ message: 'Missing extension on the import path', type: 'Literal' }],
    },
  ],
});
