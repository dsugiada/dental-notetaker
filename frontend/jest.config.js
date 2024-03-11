module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'], // Adjust this path as necessary
    testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'], // Only test files with .ts, .tsx, .js, and .jsx extensions
    moduleNameMapper: {
      '\\.(css|less|sass|scss)$': 'identity-obj-proxy', // For handling static assets
    },
    // Exclude Cypress tests from Jest
    testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
  };
  