import React, { useCallback } from 'react';
import { createPortal } from 'react-dom';
import { MicroFrontModuleBootstrapWithIsolation } from '@redneckz/microfront-core';

import { useShadow } from './use-shadow';
import { useBootstrap } from './use-bootstrap';
import { useMount } from './use-mount';

export interface MicroFrontInShadowProps<MiscParams extends Record<string, any>> {
    route?: string;

    bootstrap: MicroFrontModuleBootstrapWithIsolation<MiscParams>;

    renderError?: (error: Error) => React.ReactNode;
    children: (mountingRootRef: React.RefCallback<any>) => React.ReactNode;
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
export function MicroFrontInShadow<MiscParams extends Record<string, any>>({
    route,
    bootstrap,
    renderError = defaultErrorRenderer,
    children,
    ...misc
}: MicroFrontInShadowProps<MiscParams> & MiscParams) {
    const [shadowRoot, rootRef] = useShadow<HTMLDivElement>();

    const bootstrapModule = useCallback(async () => {
        if (!shadowRoot) return;

        return bootstrap({ route, root: shadowRoot, ...(misc as MicroFrontInShadowProps<MiscParams> & MiscParams) });
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
