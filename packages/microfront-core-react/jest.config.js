const baseConfig = require('../../jest.config.base');

module.exports = {
    ...baseConfig,
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.spec.json'
        }
    }
};
