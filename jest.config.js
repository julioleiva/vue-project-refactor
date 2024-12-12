module.exports = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^bootstrap(.*)$': '<rootDir>/tests/mocks/bootstrap-mock.js'
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.vue$': '@vue/vue2-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(axios|bootstrap)/)'
  ],
  testMatch: [
    '**/src/**/__tests__/**/*.spec.js'
  ],
  setupFiles: ['<rootDir>/tests/setup.js']
}