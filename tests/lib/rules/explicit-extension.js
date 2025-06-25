'use strict';

const path = require('path').posix;
const rule = require('../../../lib/rules/explicit-extension');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({
  languageOptions: {
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
    }
  ]
});
