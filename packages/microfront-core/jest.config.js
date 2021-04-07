const baseConfig = require('../../jest.config');

module.exports = {
    ...baseConfig,
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.spec.json'
        }
    }
};
