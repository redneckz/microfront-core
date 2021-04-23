import { useState, useEffect, useCallback } from 'react';
import { MicroFrontBootstrappedModule } from '@redneckz/microfront-core';

export function useMount<T extends Element>(bootstrappedModule?: MicroFrontBootstrappedModule): React.RefCallback<T> {
    const [mountingRoot, setMountingRoot] = useState<Element | null>(null);
    const mountingRootRef = useCallback(mountingRoot => {
        if (mountingRoot) setMountingRoot(mountingRoot);
    }, []);

    useEffect(() => {
        if (!mountingRoot || !bootstrappedModule) return;

        bootstrappedModule.mount(mountingRoot);
        return () => {
            bootstrappedModule.unmount(mountingRoot);
        };
    }, [mountingRoot, bootstrappedModule]);

    return mountingRootRef;
}
