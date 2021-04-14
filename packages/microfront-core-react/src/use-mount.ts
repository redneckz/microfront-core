import { useEffect, useRef } from 'react';
import { MicroFrontBootstrappedModule } from '@redneckz/microfront-core';

export function useMount<T extends Element>(bootstrappedModule?: MicroFrontBootstrappedModule): React.RefObject<T> {
    const mountingRootRef = useRef<T>(null);
    const { current: mountingRoot } = mountingRootRef;

    useEffect(() => {
        if (!mountingRoot || !bootstrappedModule) return;

        bootstrappedModule.mount(mountingRoot);
        return () => {
            bootstrappedModule.unmount(mountingRoot);
        };
    }, [mountingRoot, bootstrappedModule]);

    return mountingRootRef;
}
