import { useEffect } from 'react';
import { MicroFrontBootstrappedModuleWithIsolation } from '@redneckz/microfront-core';
import { useBootstrap } from './use-bootstrap';

jest.mock('react', () => ({
    useCallback: jest.fn(callback => callback),
    useEffect: jest.fn(effect => effect()),
    useState: jest.fn(() => [undefined, jest.fn()])
}));

describe('useBootstrap', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call module`s bootstrap on component mount', () => {
        expect.assertions(2);

        const bootstrap = jest.fn(() => Promise.resolve({} as MicroFrontBootstrappedModuleWithIsolation));

        useBootstrap(bootstrap);

        expect(useEffect).toBeCalledTimes(1);
        expect(bootstrap).toBeCalledTimes(1);
    });

    // TODO Integration testing
});
