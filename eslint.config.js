'use strict';

const { defineConfig } = require('eslint/config');

const globals = require('globals');
const js = require('@eslint/js');
const eslintPlugin = require('eslint-plugin-eslint-plugin');
const nodePlugin = require('eslint-plugin-n');

const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  js.configs.recommended,
  eslintPlugin.configs['flat/recommended'],
  nodePlugin.configs['flat/recommended'],
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node
      }
    },

    rules: {
      'prettier/prettier': [
        'error',
        {
          arrowParens: 'avoid',
          printWidth: 120,
          singleQuote: true,
          trailingComma: 'none'
        }
      ]
    }
  },
  {
    files: ['tests/**/*.js'],

    languageOptions: {
      globals: {
        ...globals.mocha
      }
    }
  },
  {
    files: ['eslint.config.js'],
    rules: {
      'n/no-unpublished-require': 'off'
    }
  }
]);
