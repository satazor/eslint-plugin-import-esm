'use strict';

const path = require('path').posix;
const fs = require('fs');

module.exports = {
  meta: {
    type: 'problem',
    messages: {
      missingExtension: 'Missing extension in the source path'
    },
    docs: {
      description: 'Validate if import and export paths have an explicit extension',
      recommended: true
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          extension: {
            oneOf: [
              { type: 'string' },
              {
                type: 'array',
                items: { type: 'string' }
              }
            ]
          }
        }
      }
    ]
  },

  create(context) {
    const options = context.options[0] || {};
    const defaultExtension = '.js';
    const configuredExtensions = Array.isArray(options.extension)
      ? options.extension
      : options.extension
      ? [options.extension]
      : null;

    const lintedFilePath = context.getPhysicalFilename();
    const lintedDirPath = path.dirname(lintedFilePath);
    const canFix = !['<input>', '<text>'].includes(lintedFilePath);

    const findExistingFile = (basePath) => {
      // If extensions are configured, use them in order
      if (configuredExtensions) {
        // Normal mode with configured extensions
        for (const ext of configuredExtensions) {
          try {
            const stat = fs.statSync(basePath + ext);
            if (stat.isFile()) {
              return ext;
            }
          } catch (err) {
            if (err.code !== 'ENOENT') {
              throw err;
            }
          }
        }
        return configuredExtensions[0];
      }

      // Auto-detection mode
      try {
        const dir = path.dirname(basePath);
        const baseFileName = path.basename(basePath);
        const files = fs.readdirSync(dir);

        // First check if there's an exact match with .js
        const exactMatch = files.find((file) => file === baseFileName + defaultExtension);
        if (exactMatch) {
          return defaultExtension;
        }

        // Then check if there's a file that matches the base name with any extension
        const matchingFile = files.find((file) => file.startsWith(baseFileName + '.') && file !== baseFileName);

        if (matchingFile) {
          // Extract and return the extension including the dot
          return path.extname(matchingFile);
        }
      } catch (err) {
        // If directory doesn't exist or any other error, fallback to default
      }

      return defaultExtension;
    };

    const isDirectory = (filePath) => {
      let stat;
      try {
        stat = fs.statSync(filePath);
      } catch (err) {
        if (err.code !== 'ENOENT') {
          throw err;
        }
      }
      return stat ? stat.isDirectory() : false;
    };

    const handleImportOrExportNode = (node) => {
      if (!node.source || node.source.type !== 'Literal') {
        return;
      }

      const importPath = node.source.value;
      const isRelativeImport = importPath.startsWith('.');
      const ext = path.extname(importPath);
      const hasJsExtension = ext === defaultExtension;

      // Skip if this is not a relative import
      // Skip if it already has .js extension
      if (!isRelativeImport || hasJsExtension) {
        return;
      }

      // Skip if it has a configured extension and we're using configured extensions
      if (configuredExtensions && ext && configuredExtensions.includes(ext)) {
        return;
      }

      context.report({
        messageId: 'missingExtension',
        node: node.source,
        fix: !canFix
          ? null
          : (fixer) => {
              let absoluteImportPath = path.resolve(lintedDirPath, importPath);

              if (isDirectory(absoluteImportPath)) {
                absoluteImportPath += path.sep + 'index' + defaultExtension;
              } else if (configuredExtensions) {
                // Using configured extensions
                const basePathWithoutExt = ext ? absoluteImportPath.slice(0, -ext.length) : absoluteImportPath;
                absoluteImportPath = basePathWithoutExt + findExistingFile(basePathWithoutExt);
              } else if (ext) {
                // Auto-detection mode with existing extension
                absoluteImportPath += defaultExtension;
              } else {
                // Auto-detection mode without extension
                absoluteImportPath += findExistingFile(absoluteImportPath);
              }

              let newImportPath = path.relative(lintedDirPath, absoluteImportPath);

              if (!newImportPath.startsWith('.')) {
                newImportPath = './' + newImportPath;
              }

              return fixer.replaceText(node.source, `'${newImportPath}'`);
            }
      });
    };

    return {
      ImportExpression: handleImportOrExportNode,
      ImportDeclaration: handleImportOrExportNode,
      ExportNamedDeclaration: handleImportOrExportNode,
      ExportAllDeclaration: handleImportOrExportNode
    };
  }
};
