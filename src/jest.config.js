module.exports = {
    testEnvironment: 'jsdom', // Simulate browser environment
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Add any setup before each test
    moduleDirectories: ['node_modules', 'src'], // Allow absolute imports from 'src'
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
    },
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest', // Use Babel to transpile JavaScript and JSX
    },
  };
  