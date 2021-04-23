import { useState } from 'react';
import { useShadow } from './use-shadow';

jest.mock('react', () => ({
    useState: jest.fn(() => [undefined, jest.fn()]),
    useCallback: jest.fn(callback => callback)
}));

describe('useShadow', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return attached shadow root', () => {
        const shadowRoot = {} as ShadowRoot;
        (useState as jest.Mock).mockReturnValueOnce([shadowRoot, jest.fn()]);

        const pair = useShadow();

        expect(pair[0]).toBe(shadowRoot);
    });

    it('should attach shadow to the provided node', () => {
        const attachShadow = jest.fn() as Element['attachShadow'];
        const root = { attachShadow } as Element;

        const [, effect] = useShadow();
        effect(root);

        expect(attachShadow).toBeCalledWith({ mode: 'open' });
    });

    // TODO Integration testing
});
