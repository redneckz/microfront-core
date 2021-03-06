import { fireMicroFrontEvent } from './microfront-api.events';
import {
    MicroFrontBootstrappedModuleWithIsolation,
    MicroFrontIsolation,
    MicroFrontModule,
    MicroFrontModuleBootstrapWithIsolation
} from './microfront-api.model';
import { container, isolateModule, wrap } from './microfront-isolation-api';
import { bindStyles, unbindStyles } from './microfront-isolation-api.style';

/**
 * Registers MF module
 *
 * Template example:
 * <div class="layout-slot">
 *   #shadow-root
 *     <div id="mountingRoot">Loading...</div>
 * </div
 *
 * @param name - remote module name (defined in Module Federation config)
 * @param module - async import of MF module
 * @param options - optional
 * @returns wrapped MF`s bootstrap
 */
export function register<MiscParams extends Record<string, any> = {}>(
    name: string,
    module: () => Promise<MicroFrontModule>,
    options: { isolation?: MicroFrontIsolation } = {}
): MicroFrontModuleBootstrapWithIsolation<MiscParams> {
    const { isolation } = options;
    if (isolation === MicroFrontIsolation.SANDBOX) {
        throw new Error('MicroFrontIsolation.SANDBOX isolation level is not supported yet...');
    }

    const bootstrap = isolateModule<ReturnType<MicroFrontModuleBootstrapWithIsolation>>(name)(
        async (params): Promise<MicroFrontBootstrappedModuleWithIsolation> => {
            const { bootstrap } = await module();
            fireMicroFrontEvent('fetched', { name });
            const { mount, unmount } = await bootstrap(params);
            fireMicroFrontEvent('bootstrapped', { name });
            return {
                mount: wrap(async mountingRoot => {
                    bindStyles();
                    await mount(mountingRoot);
                    fireMicroFrontEvent('mounted', { name, mountingRoot });
                }, 'mount'),
                unmount: wrap(async mountingRoot => {
                    await unmount(mountingRoot);
                    unbindStyles();
                    fireMicroFrontEvent('unmounted', { name, mountingRoot });
                }, 'mount'),
                container: container()
            };
        }
    ) as MicroFrontModuleBootstrapWithIsolation;
    bootstrap.isolationType = isolation;

    return bootstrap;
}
