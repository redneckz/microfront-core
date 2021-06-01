import { useState } from 'react';
import { MicroFrontIsolation } from '@redneckz/microfront-core';

import { useRoot } from './use-root';

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

        const pair = useRoot(MicroFrontIsolation.SHADOW);

        expect(pair[0]).toBe(shadowRoot);
    });

    it('should attach shadow to the provided node', () => {
        const attachShadow = jest.fn() as Element['attachShadow'];
        const root = { attachShadow } as Element;

        const [, effect] = useRoot(MicroFrontIsolation.SHADOW);
        effect(root);

        expect(attachShadow).toBeCalledWith({ mode: 'open' });
    });

    // TODO Integration testing
});
