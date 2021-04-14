import { useRef, useEffect } from 'react';

export function useShadow<T extends Element>(): [ShadowRoot | null, React.RefObject<T>] {
    const rootRef = useRef<T>(null);
    const { current: root } = rootRef;

    useEffect(() => {
        if (!root || root.shadowRoot) return;

        root.attachShadow({ mode: 'open' });
    }, [root]);

    return [root && root.shadowRoot, rootRef];
}
