'use strict';

const path = require('path').posix;
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
      filename: __filename
    },
    {
      name: 'import relative file with custom extension',
      code: `import foo from './foo.types';`,
      filename: __filename,
      options: [{ extension: '.types' }]
    },
    {
      name: 'import relative file with custom extension array',
      code: `import foo from './foo.services';`,
      filename: __filename,
      options: [{ extension: ['.services', '.types', '.js'] }]
    },
    {
      name: 'import relative file with existing extension',
      code: `import foo from './foo.bar.js';`,
      filename: __filename
    },
    {
      name: 'import relative file with multiple extensions',
      code: `import foo from './foo.bar.baz.js';`,
      filename: __filename
    },
    {
      name: 'import relative file with many extensions',
      code: `import foo from './foo.bar.baz.qux.js';`,
      filename: __filename
    },
    {
      name: 'ignore computed dynamic imports',
      code: `
const foo = 'foo.js';
import(\`./lib/\${foo}\`);
`,
      filename: path.resolve('./foo.js')
    },
    {
      name: 'ignore regular exports',
      code: `
const foo = 'foo';
export default foo;
export { foo };
`,
      filename: path.resolve('./foo.js')
    },
    {
      name: 'ignore package imports',
      code: `
import foo from 'foo';
import bar from 'foo/bar';
import baz from '@scope/package';
import qux from '@scope/package/utils';
`,
      filename: __filename
    }
  ],

  invalid: [
    {
      name: 'import relative file without extension',
      code: `import foo from './foo';`,
      output: `import foo from './foo.js';`,
      filename: __filename,
      errors: [{ message: 'Missing extension in the source path', type: 'Literal' }]
    },
    {
      name: 'import relative file without extension, starting with ../',
      code: `import foo from '../test/lib/rules/foo';`,
      output: `import foo from '../test/lib/rules/foo.js';`,
      filename: path.resolve('./tests'),
      errors: [{ message: 'Missing extension in the source path', type: 'Literal' }]
    },
    {
      name: 'import relative directory without extension',
      code: `import lib from './lib';`,
      output: `import lib from './lib/index.js';`,
      filename: path.resolve('./foo.js'),
      errors: [{ message: 'Missing extension in the source path', type: 'Literal' }]
    },
    {
      name: 'import relative directory without extension, starting with ../',
      code: `import lib from '../lib';`,
      output: `import lib from '../lib/index.js';`,
      filename: path.resolve('./tests/foo.js'),
      errors: [{ message: 'Missing extension in the source path', type: 'Literal' }]
    },
    {
      name: 'not fixable if there is no source file name',
      code: `import foo from './foo';`,
      output: null,
      errors: [{ message: 'Missing extension in the source path', type: 'Literal' }]
    },
    {
      name: 'dynamic import relative file without extension',
      code: `import('./foo');`,
      output: `import('./foo.js');`,
      filename: __filename,
      errors: [{ message: 'Missing extension in the source path', type: 'Literal' }]
    },
    {
      name: 'dynamic import relative directory without extension',
      code: `import('./lib');`,
      output: `import('./lib/index.js');`,
      filename: path.resolve('./foo.js'),
      errors: [{ message: 'Missing extension in the source path', type: 'Literal' }]
    },
    {
      name: 'export relative file without extension',
      code: `export { foo } from './foo';`,
      output: `export { foo } from './foo.js';`,
      filename: __filename,
      errors: [{ message: 'Missing extension in the source path', type: 'Literal' }]
    },
    {
      name: 'export default relative file without extension',
      code: `export { default } from './foo';`,
      output: `export { default } from './foo.js';`,
      filename: __filename,
      errors: [{ message: 'Missing extension in the source path', type: 'Literal' }]
    },
    {
      name: 'export all relative file without extension',
      code: `export * from './foo';`,
      output: `export * from './foo.js';`,
      filename: __filename,
      errors: [{ message: 'Missing extension in the source path', type: 'Literal' }]
    },
    {
      name: 'import relative file without extension with custom extension array',
      code: `import foo from './foo';`,
      output: `import foo from './foo.types';`,
      filename: __filename,
      options: [{ extension: ['.types', '.js'] }],
      errors: [{ message: 'Missing extension in the source path', type: 'Literal' }]
    },
    {
      name: 'import relative file without extension with custom extension array and existing file',
      code: `import foo from './foo';`,
      output: `import foo from './foo.services';`,
      filename: __filename,
      options: [{ extension: ['.services', '.types', '.js'] }],
      errors: [{ message: 'Missing extension in the source path', type: 'Literal' }]
    },
    {
      name: 'import relative file with existing extension but missing .js',
      code: `import foo from './foo.bar';`,
      output: `import foo from './foo.bar.js';`,
      filename: __filename,
      errors: [{ message: 'Missing extension in the source path', type: 'Literal' }]
    },
    {
      name: 'import relative file with multiple extensions but missing .js',
      code: `import foo from './foo.bar.baz';`,
      output: `import foo from './foo.bar.baz.js';`,
      filename: __filename,
      errors: [{ message: 'Missing extension in the source path', type: 'Literal' }]
    },
    {
      name: 'import relative file with many extensions but missing .js',
      code: `import foo from './foo.bar.baz.qux';`,
      output: `import foo from './foo.bar.baz.qux.js';`,
      filename: __filename,
      errors: [{ message: 'Missing extension in the source path', type: 'Literal' }]
    }
  ]
});
