import { useCallback, useEffect, useState } from 'react';
import { MicroFrontBootstrappedModuleWithIsolation } from '@redneckz/microfront-core';

export function useBootstrap(
    bootstrap: () => Promise<MicroFrontBootstrappedModuleWithIsolation | undefined>
): [MicroFrontBootstrappedModuleWithIsolation | undefined, Error | undefined] {
    const [bootstrappedModule, setModule] = useState<MicroFrontBootstrappedModuleWithIsolation>();
    const [error, setError] = useState<Error>();

    const bootstrapModule = useCallback(async () => {
        if (bootstrappedModule || error) return;

        try {
            setModule(await bootstrap());
        } catch (ex) {
            setError(ex);
        }
    }, [bootstrap, bootstrappedModule, error]);

    useEffect(() => {
        bootstrapModule();
    }, [bootstrapModule]);

    return [bootstrappedModule, error];
}
