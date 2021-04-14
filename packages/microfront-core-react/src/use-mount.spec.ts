import { useEffect, useRef } from 'react';
import { MicroFrontBootstrappedModule } from '@redneckz/microfront-core';
import { useMount } from './use-mount';

jest.mock('react', () => ({
    useRef: jest.fn(() => ({
        current: null
    })),
    useEffect: jest.fn(effect => effect())
}));

describe('useMount', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return mounting root reference', () => {
        const mountintRootRef = { current: {} as Element };
        (useRef as jest.Mock).mockReturnValue(mountintRootRef);

        expect(useMount()).toBe(mountintRootRef);
    });

    it('should mount remote module on component mount', () => {
        expect.assertions(2);

        const bootstrappedModule: MicroFrontBootstrappedModule = {
            mount: jest.fn(),
            unmount: jest.fn()
        };
        (useRef as jest.Mock).mockReturnValue({
            current: {} as Element
        });

        useMount(bootstrappedModule);

        expect(useEffect).toBeCalledTimes(1);
        expect(bootstrappedModule.mount).toBeCalledTimes(1);
    });

    it('should unmount remote module on component unmount', () => {
        const bootstrappedModule: MicroFrontBootstrappedModule = {
            mount: jest.fn(),
            unmount: jest.fn()
        };
        (useRef as jest.Mock).mockReturnValue({
            current: {} as Element
        });

        useMount(bootstrappedModule);
        const destructor = (useEffect as jest.Mock).mock.results[0].value;
        destructor();

        expect(bootstrappedModule.unmount).toBeCalledTimes(1);
    });

    // TODO Integration testing
});
