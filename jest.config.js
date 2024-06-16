module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(test).ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  setupFiles: ['dotenv/config'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '__mocks__' ],
};