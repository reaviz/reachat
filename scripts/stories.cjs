const fs = require('fs');
const fg = require('fast-glob');
const { rewritePaths } = require('typescript-rewrite-paths');
const path = require('path');

const EXCLUDED_PATHS = ['./examples', './assets'];

/**
 * Replace all the paths in the stories from `./Block` to `reablocks`
 */
function replacePaths() {
  // Grep all the stories
  const files = fg.sync(['dist/stories/*.tsx', 'dist/stories/*.ts', 'dist/blocks/*.tsx']);

  files.forEach((file) => {
    const code = fs.readFileSync(file, { encoding: 'utf-8' });

    const output = rewritePaths(code, path => {
      if (EXCLUDED_PATHS.some(excludedPath => path.startsWith(excludedPath))) {
        return path;
      }

      if (path.startsWith('./') || path.startsWith('../') || path.startsWith('@/')) {
        console.info(`Replacing ${path} with reachat`);
        return 'reachat';
      }

      return path;
    });

    fs.writeFileSync(file, output);
  });
}

replacePaths();
