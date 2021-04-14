import { useCallback, useEffect, useState } from 'react';
import { MicroFrontBootstrappedModule } from '@redneckz/microfront-core';

export function useBootstrap(
    bootstrap: () => Promise<MicroFrontBootstrappedModule | undefined>
): [MicroFrontBootstrappedModule | undefined, Error | undefined] {
    const [bootstrappedModule, setModule] = useState<MicroFrontBootstrappedModule>();
    const [error, setError] = useState<Error>();

    const bootstrapModule = useCallback(async () => {
        if (bootstrappedModule || error) return;

        try {
            setModule(await bootstrap());
        } catch (ex) {
            setError(ex);
        }
    }, [bootstrap, bootstrappedModule, setModule, error, setError]);

    useEffect(() => {
        bootstrapModule();
    }, [bootstrapModule]);

    return [bootstrappedModule, error];
}
