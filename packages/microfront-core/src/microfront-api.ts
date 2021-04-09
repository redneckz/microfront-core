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
 * @param module - async import of MF module
 * @param options
 * @returns wrapped MF`s bootstrap
 */
export async function register(
    module: () => Promise<MicroFrontModule>,
    options: { isolation?: MicroFrontIsolation } = {}
): Promise<MicroFrontModuleBootstrap> {
    const { isolation } = options;
    if (isolation === MicroFrontIsolation.SANDBOX) {
        throw new Error('MicroFrontIsolation.SANDBOX isolation level is not supported yet...');
    }
    return async api => {
        const { bootstrap } = await module();
        const { mount, unmount } = await bootstrap(api);
        return {
            async mount(mountingRoot) {
                isolationAPI(api).bindStyles();
                await mount(mountingRoot);
            },
            async unmount(mountingRoot) {
                await unmount(mountingRoot);
                isolationAPI(api).unbindStyles();
            }
        };
    };
}
