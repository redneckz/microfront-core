import React, { useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
    MicroFrontIsolation,
    MicroFrontModuleBootstrapWithIsolation
} from '@redneckz/microfront-core';

import { useRoot } from './use-root';
import { useBootstrap } from './use-bootstrap';
import { useMount } from './use-mount';

export interface MicroFrontContainerProps<MiscParams extends Record<string, any>> {
    route?: string;

    bootstrap: MicroFrontModuleBootstrapWithIsolation<MiscParams>;

    renderError?: (error: Error) => React.ReactNode;
    children: (mountingRootRef: React.RefCallback<any>) => React.ReactNode;
}

/**
 * MicroFrontContainer is responsible for the shadow DOM isolation of loaded MF.
 * It accepts "bootstrap" function produced by @redneckz/microfront-core "register" function.
 *
 * @param route - root route dedicated for remote module
 * @param bootstrap - bootstrap function provided by @redneckz/microfront-core "register" function
 * @param renderError - render something in case of bootstrap/mount/unmount error
 * @param children - kind of loading and success handler
 * @returns
 */
export function MicroFrontContainer<MiscParams extends Record<string, any>>({
    route,
    bootstrap,
    renderError = defaultErrorRenderer,
    children,
    ...misc
}: MicroFrontContainerProps<MiscParams> & MiscParams) {
    const { isolationType = MicroFrontIsolation.SHADOW } = bootstrap;

    const [shadowRoot, rootRef] = useRoot<HTMLDivElement>(isolationType);

    const bootstrapModule = useCallback(async () => {
        if (!shadowRoot) return;

        return bootstrap({ route, root: shadowRoot, ...(misc as MicroFrontContainerProps<MiscParams> & MiscParams) });
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
