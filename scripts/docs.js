import { readFileSync, writeFileSync } from 'fs';
import fg from 'fast-glob';
import { basename, resolve } from 'path';
import docgen from 'react-docgen-typescript';

/**
 * Builds the doc types.
 */
function buildDocs() {
  // TS 6 requires consistently absolute paths (mixing styles trips
  // "Paths must either both be absolute or both be relative" in the compiler)
  const files = fg.sync('src/**/!(*.stories).tsx', { absolute: true });

  const result = [];
  let count = 0;
  let fail = 0;
  const options = {
    savePropValueAsString: true,
    // Skip generating docs for HTML attributes
    propFilter: (prop) => {
      if (prop.declarations !== undefined && prop.declarations.length > 0) {
        const hasPropAdditionalDescription = prop.declarations.find((declaration) => {
          return !declaration.fileName.includes('node_modules');
        });

        return Boolean(hasPropAdditionalDescription);
      }

      return true;
    },
  };

  const docgenWithTSConfig = docgen.withCustomConfig(
    resolve('tsconfig.json'),
    options
  );

  files.forEach(file => {
    console.log('Reading', file);

    try {
      const documentation = docgenWithTSConfig.parse(file, options);
      if (documentation) {
        // Absolute input paths surface in filePath/fileName fields — strip
        // the cwd (and project-dir) prefixes so docs.json stays
        // machine-independent and matches the historical relative format
        const cwdPrefix = process.cwd() + '/';
        const projPrefix = basename(process.cwd()) + '/';
        const normalize = value => {
          if (value.startsWith(cwdPrefix)) return value.slice(cwdPrefix.length);
          if (value.startsWith(projPrefix)) return value.slice(projPrefix.length);
          return value;
        };
        const normalized = JSON.parse(
          JSON.stringify(documentation),
          (key, value) =>
            (key === 'filePath' || key === 'fileName') && typeof value === 'string'
              ? normalize(value)
              : value
        );
        result.push(...normalized);
        count++;
      }
    } catch (e) {
      fail++;
      console.error('Error reading', file, e);
    }
  });

  const fileName = resolve('dist', 'docs.json');
  writeFileSync(fileName, JSON.stringify(result, null, 2));

  console.info('Docs created!', fileName);
  console.info('Failed:', fail);
  console.info('Total Doc:', count);
}

buildDocs();
