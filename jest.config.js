module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'routes/**/*.js',
    '!**/node_modules/**'
  ],
  setupFiles: ['dotenv/config']
};
