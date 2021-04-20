import React, { useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MicroFrontModuleBootstrap } from '@redneckz/microfront-core';

import { useShadow } from './use-shadow';
import { useBootstrap } from './use-bootstrap';
import { useMount } from './use-mount';

export interface MicroFrontInShadowProps {
    route?: string;

    bootstrap: MicroFrontModuleBootstrap;

    renderError?: (error: Error) => React.ReactNode;
    children: (mountingRootRef: React.RefObject<any>) => React.ReactNode;
}

/**
 * MicroFrontInShadow is responsible for the shadow DOM isolation of loaded MF.
 * It accepts "bootstrap" function produced by @redneckz/microfront-core "register" function.
 *
 * @param route - root route dedicated for remote module
 * @param bootstrap - bootstrap function provided by @redneckz/microfront-core "register" function
 * @param renderError - render something in case of bootstrap/mount/unmount error
 * @param children - kind of loading and success handler
 * @returns
 */
export function MicroFrontInShadow({ route, bootstrap, renderError = defaultErrorRenderer, children }: MicroFrontInShadowProps) {
    const [shadowRoot, rootRef] = useShadow<HTMLDivElement>();

    const bootstrapModule = useCallback(async () => {
        if (!shadowRoot) return;

        return bootstrap({ route, root: shadowRoot });
    }, [bootstrap, route, shadowRoot]);

    const [bootstrappedModule, error] = useBootstrap(bootstrapModule);

    const mountingRootRef = useMount(bootstrappedModule);

    const renderToShadowRoot = (children: React.ReactNode) =>
        shadowRoot ? createPortal(children, shadowRoot as any) : children;

    return (
        <div ref={rootRef} role="document" aria-atomic="true">
            {renderToShadowRoot(
                error
                    ? // handle module loading error
                      renderError(error)
                    : // render mounting root placehoder by means of render props, cause layout is up to host container
                      children(mountingRootRef)
            )}
        </div>
    );
}

function defaultErrorRenderer(error: Error): React.ReactNode {
    throw error;
}
