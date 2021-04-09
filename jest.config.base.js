module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageDirectory: 'coverage/',
    collectCoverageFrom: ['src/**/*.ts'],
    clearMocks: true
};
