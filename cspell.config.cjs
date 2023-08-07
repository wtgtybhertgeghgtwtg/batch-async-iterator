const {noCase} = require('no-case');
const {devDependencies, repository} = require('./package.json');

module.exports = {
  language: 'en-US',
  useGitignore: true,
  version: '0.2',
  words: [
    ...new Set([
      // It'd be nice if there was an in-between with `no-case` so it didn't have to be split.
      ...noCase(repository).split(' '),
      ...Object.keys(devDependencies).flatMap((key) => noCase(key).split(' ')),
      'automerge',
      'pnpm',
      'typecheck',
    ]),
  ].sort(),
};
