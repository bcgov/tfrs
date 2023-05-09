module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,jsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 5,
      functions: 5,
      lines: 5,
      statements: -8500
    }
  },
  moduleFileExtensions: ['js', 'node'],
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': '<rootDir>/__mocks__/style.js',
    'react-markdown': '<rootDir>/node_modules/react-markdown/react-markdown.min.js'
  },
  testEnvironmentOptions: {
    url: 'http://localhost/'
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react.*|@babel.*|es.*)/)'
  ],
  verbose: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: [
    '<rootDir>/setupTests.js'
  ]
}
