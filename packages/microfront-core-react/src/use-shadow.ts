import { useState, useCallback } from 'react';

export function useShadow<T extends Element>(): [ShadowRoot | null, React.RefCallback<T>] {
    const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
    const rootRef = useCallback(root => {
        if (!root || root.shadowRoot) return;

        setShadowRoot(root.attachShadow({ mode: 'open' }));
    }, []);
    return [shadowRoot, rootRef];
}
