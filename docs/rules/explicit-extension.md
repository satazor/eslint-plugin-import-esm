# Validate if import and export paths have an explicit extension (`import-esm/explicit-extension`)

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Checks if the import path has an explicit extension.

When `--fix` is used and a path is a directory, `index` will be appended accordingly. Please note that this package does not yet support `exports` field in `package.json`.

## Rule Details

Examples of **incorrect** code for this rule:

```js
import foo from './foo'; // Missing extension
import foo from './foo.bar'; // Missing .js extension
import foo from './foo.bar.baz'; // Missing .js extension
import foo from './foo.bar.baz.qux'; // Missing .js extension
import foo from './bar'; // Missing directory index.js
```

Examples of **correct** code for this rule:

```js
import foo from './foo.js'; // Regular JavaScript file
import foo from './foo.bar.js'; // With one extension
import foo from './foo.bar.baz.js'; // With multiple extensions
import foo from './foo.bar.baz.qux.js'; // With many extensions
import bar from './bar/index.js'; // Directory import
```

## Config

This rule accepts an options object with the following properties:

### `extension`

Type: `string | string[]`\
Default: `".js"`

The extension to use when auto-fixing. Can be either a string or an array of strings. When an array is provided, the rule will:

1. For files: Try to find an existing file with any of the provided extensions in order. If no file is found, use the first extension.
2. For directories: Always use the first extension in the array.

Examples:

```json
{
  "import-esm/explicit-extension": ["error", { "extension": ".mjs" }]
}
```

Or with multiple extensions:

```json
{
  "import-esm/explicit-extension": ["error", { "extension": [".bar", ".js"] }]
}
```

## Implementation Examples

1. Basic usage (default configuration):

```js
// ❌ Invalid
import foo from './foo';
import foo from './foo.bar';
import foo from './foo.bar.baz';
import utils from './utils';

// ✅ Valid
import foo from './foo.js';
import foo from './foo.bar.js';
import foo from './foo.bar.baz.js';
import utils from './utils/index.js';
```

2. With custom extension configuration:

```js
// Configuration: { "extension": [".bar", ".js"] }

// ❌ Invalid
import foo from './foo';
import foo from './foo.bar'; // When .bar is in extensions array, needs .js
import utils from './utils';

// ✅ Valid
import foo from './foo.bar'; // When .bar is the final extension
import foo from './foo.bar.js'; // When .bar needs .js
import utils from './utils/index.js';
```

3. With multiple extensions:

```js
// Configuration: { "extension": [".types", ".bar", ".js"] }

// ❌ Invalid
import foo from './foo'; // Will be fixed to use first found extension
import type from './foo.types'; // When .types is in extensions array, needs .js
import bar from './foo.bar'; // When .bar is in extensions array, needs .js

// ✅ Valid
import foo from './foo.types'; // When .types is the final extension
import type from './foo.types.js'; // When .types needs .js
import bar from './foo.bar.js'; // When .bar needs .js
import utils from './utils/index.js';
```

4. Files with multiple extensions:

```js
// ❌ Invalid
import foo from './foo.bar.baz'; // Missing .js
import foo from './foo.bar.baz.qux'; // Missing .js

// ✅ Valid
import foo from './foo.bar.baz.js'; // Multiple extensions with .js
import foo from './foo.bar.baz.qux.js'; // Many extensions with .js
```

## Behavior Details

The rule handles different scenarios based on configuration:

1. When extensions are configured (`extension` option):

   - Files without extension will try each configured extension in order
   - Files with a configured extension are valid as-is
   - Files with a configured extension that need `.js` will have it appended
   - Directories always use the first extension

2. When no extensions are configured (auto-detection):
   - Files without extension will use `.js`
   - Files with any extension(s) will have `.js` appended
   - Directories always use `.js`

Note: When a file has multiple extensions (e.g., `.bar.baz.qux`), the rule will still append `.js` if it's not already present.
