import { useCallback, useState } from 'react';

import { MicroFrontIsolation } from '@redneckz/microfront-core';

export function useRoot<T extends Element>(
    isolationType: MicroFrontIsolation
): [ShadowRoot | null, React.RefCallback<T>] {
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
    const rootRef = useCallback(root => {
        if (!root || root.shadowRoot) return;

        isolationType === MicroFrontIsolation.SHADOW
            ? setShadowRoot(root.attachShadow({ mode: 'open' }))
            : setShadowRoot(root);
    }, []);
    return [shadowRoot, rootRef];
}
