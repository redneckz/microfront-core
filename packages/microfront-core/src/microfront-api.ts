import { fireMicroFrontEvent } from './microfront-api.events';
import {
    MicroFrontBootstrappedModule,
    MicroFrontIsolation,
    MicroFrontModule,
    MicroFrontModuleBootstrap
} from './microfront-api.model';
import { isolateModule, bindStyles, unbindStyles, wrap } from './microfront-isolation-api';

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
): MicroFrontModuleBootstrap<MiscParams> {
    const { isolation } = options;
    if (isolation === MicroFrontIsolation.SANDBOX) {
        throw new Error('MicroFrontIsolation.SANDBOX isolation level is not supported yet...');
    }
    return isolateModule(name)(
        async (params): Promise<MicroFrontBootstrappedModule> => {
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
                }, 'mount')
            };
        }
    );
}
