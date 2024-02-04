'use strict';

const path = require('path');
const fs = require('fs');

const isDirectory = (path) => {
  let stat;

  try {
    stat = fs.statSync(path);

  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }

  return stat ? stat.isDirectory() : false;
};

module.exports = {
  meta: {
    type: 'problem',
    messages: {
      missingExtension: 'Missing extension in the source path'
    },
    docs: {
      description: 'Validate if import and export paths have an explicit extension',
      recommended: true,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          extension: {
            type: 'string',
          }
        }
      }
    ]
  },

  create(context) {
    const options = {
      ...context.options,
      extension: '.js',
    };

    const lintedFilePath = context.getPhysicalFilename();
    const lintedDirPath = path.posix.dirname(lintedFilePath);
    const canFix = !['<input>', '<text>'].includes(lintedFilePath);

    const handleImportOrExportNode = (node) => {
      // Skip if node does not have a source (regular exports) or is not a literal (e.g.: when template literals).
      if (!node.source || node.source.type !== 'Literal') {
        return;
      }

      const importPath = node.source.value;
      const isRelativeImport = importPath.startsWith('.');
      const hasExtension = !!path.posix.extname(importPath);

      // Skip if this is not a relative import.
      // Skip if an extension is specified.
      if (!isRelativeImport || hasExtension) {
        return;
      }

      context.report({
        messageId: 'missingExtension',
        node: node.source,
        fix: !canFix ? null : (fixer) => {
          // Calculate extension-less absolute path.
          // If its a directory, we append /index.
          let absoluteImportPath = path.posix.resolve(lintedDirPath, importPath);

          if (isDirectory(absoluteImportPath)) {
            absoluteImportPath += path.posix.sep + 'index';
          }

          absoluteImportPath += options.extension;

          // Relativize the extension-less absolute path and replace it in the source.
          let newImportPath = path.posix.relative(lintedDirPath, absoluteImportPath);

          if (!newImportPath.startsWith('.')) {
            newImportPath = './' + newImportPath;
          }

          return fixer.replaceText(node.source, `'${newImportPath}'`);
        },
      });
    };

    return {
      ImportExpression: handleImportOrExportNode,
      ImportDeclaration: handleImportOrExportNode,
      ExportNamedDeclaration: handleImportOrExportNode,
      ExportAllDeclaration: handleImportOrExportNode
    };
  },
};
