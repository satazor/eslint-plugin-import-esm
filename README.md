# eslint-plugin-import-esm

ESLint plugin that enforces imports to follow native ESM resolution.

## Installation

You'll first need to install [ESLint v9](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-import-esm`:

```sh
npm install eslint-plugin-import-esm --save-dev
```

This plugin works well with [`eslint-plugin-import`](https://github.com/import-js/eslint-plugin-import), which validates existence of paths amongst other checks.

## Usage

Using the recommended preset:

```js
import { defineConfig } from "eslint/config";
import importEsmPlugin from 'eslint-plugin-import-esm';

export default defineConfig([
  importEsmPlugin.configs.recommended,
  ...
]);
```

Using without the recommended preset:

```js
import { defineConfig } from "eslint/config";
import importEsmPlugin from 'eslint-plugin-import-esm';

export default defineConfig([
  {
    plugins: { 'import-esm': importEsmPlugin },
    rules: {
      'import-esm/explicit-extension': ['error', { extension: '.mjs' }]
    }
  }
]);
```

## Rules

<!-- begin auto-generated rules list -->

💼 Configurations enabled in.\
✅ Set in the `recommended` configuration.\
🔧 Automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/user-guide/command-line-interface#--fix).

| Name                                                   | Description                                                    | 💼 | 🔧 |
| :----------------------------------------------------- | :------------------------------------------------------------- | :- | :- |
| [explicit-extension](docs/rules/explicit-extension.md) | Validate if import and export paths have an explicit extension | ✅  | 🔧 |

<!-- end auto-generated rules list -->

## Configs

<!-- begin auto-generated configs list -->

|    | Name          |
| :- | :------------ |
| ✅  | `recommended` |

<!-- end auto-generated configs list -->
