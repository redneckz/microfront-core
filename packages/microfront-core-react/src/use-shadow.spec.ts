import { useEffect, useRef } from 'react';
import { useShadow } from './use-shadow';

jest.mock('react', () => ({
    useRef: jest.fn(() => ({
        current: null
    })),
    useEffect: jest.fn(effect => effect())
}));

describe('useShadow', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return attached shadow root and root node reference', () => {
        expect.assertions(2);

        const shadowRoot = {} as ShadowRoot;
        const rootRef = { current: { shadowRoot } as Element };
        (useRef as jest.Mock).mockReturnValue(rootRef);

        const pair = useShadow();

        expect(pair[0]).toBe(shadowRoot);
        expect(pair[1]).toBe(rootRef);
    });

    it('should attach shadow to the provided node', () => {
        expect.assertions(2);

        const attachShadow = jest.fn() as Element['attachShadow'];
        (useRef as jest.Mock).mockReturnValue({
            current: { attachShadow } as Element
        });

        useShadow();

        expect(useEffect).toBeCalledTimes(1);
        expect(attachShadow).toBeCalledWith({ mode: 'open' });
    });

    // TODO Integration testing
});
