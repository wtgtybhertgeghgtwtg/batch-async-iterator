module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['build/*.js'],
  coverageProvider: 'v8',
  moduleNameMapper: {'^../source/(.*).js$': '<rootDir>/build/$1.js'},
  testMatch: ['**/*.test.ts'],
};
