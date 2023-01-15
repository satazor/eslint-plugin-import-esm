# Validate if import paths have an explicit extension (`import-esm/explicit-extension`)

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Checks if the import path has an explicit extension.

When `--fix` is used and a path is a directory,`index` will be appended accordingly. Please note that this package does not yet support `exports` field in `package.json`.

## Rule Details

Examples of **incorrect** code for this rule:

```js
import foo from './foo';
```

Examples of **correct** code for this rule:

```js
import foo from './foo.js'
import bar from './bar/index.js'
```

### Options

#### `extension`

The extension to use when auto-fixing. Defaults to `.js`.

```json
{
  "import-esm/explicit-extension": ["error", { "extension": ".mjs" }]
}
```
