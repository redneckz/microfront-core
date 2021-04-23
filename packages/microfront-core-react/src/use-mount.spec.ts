import { useState, useEffect } from 'react';
import { MicroFrontBootstrappedModule } from '@redneckz/microfront-core';
import { useMount } from './use-mount';

jest.mock('react', () => ({
    useState: jest.fn(() => [undefined, jest.fn()]),
    useCallback: jest.fn(callback => callback),
    useEffect: jest.fn(effect => effect())
}));

describe('useMount', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should mount remote module on component mount', () => {
        expect.assertions(2);

        const bootstrappedModule: MicroFrontBootstrappedModule = {
            mount: jest.fn(),
            unmount: jest.fn()
        };
        (useState as jest.Mock).mockReturnValueOnce([{} as Element, jest.fn()]);

        useMount(bootstrappedModule);

        expect(useEffect).toBeCalledTimes(1);
        expect(bootstrappedModule.mount).toBeCalledTimes(1);
    });

    it('should unmount remote module on component unmount', () => {
        const bootstrappedModule: MicroFrontBootstrappedModule = {
            mount: jest.fn(),
            unmount: jest.fn()
        };
        (useState as jest.Mock).mockReturnValueOnce([{} as Element, jest.fn()]);

        useMount(bootstrappedModule);
        const destructor = (useEffect as jest.Mock).mock.results[0].value;
        destructor();

        expect(bootstrappedModule.unmount).toBeCalledTimes(1);
    });

    // TODO Integration testing
});
