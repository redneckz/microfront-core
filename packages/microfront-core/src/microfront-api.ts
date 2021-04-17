import { MicroFrontIsolation, MicroFrontModule, MicroFrontModuleBootstrap } from './microfront-api.model';
import { isolationAPI } from './microfront-isolation-api';

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
export function register(
    name: string,
    module: () => Promise<MicroFrontModule>,
    options: { isolation?: MicroFrontIsolation } = {}
): MicroFrontModuleBootstrap {
    const { isolation } = options;
    if (isolation === MicroFrontIsolation.SANDBOX) {
        throw new Error('MicroFrontIsolation.SANDBOX isolation level is not supported yet...');
    }
    return async api => {
        const { bootstrap } = await module();
        const { mount, unmount } = await bootstrap(api);
        const { bindStyles, unbindStyles } = isolationAPI(name, { root: api.root });
        return {
            async mount(mountingRoot) {
                bindStyles();
                await mount(mountingRoot);
            },
            async unmount(mountingRoot) {
                await unmount(mountingRoot);
                unbindStyles();
            }
        };
    };
}
