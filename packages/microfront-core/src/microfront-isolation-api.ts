import { MicroFrontParams } from './microfront-api.model';
import { assertModuleZone, createModuleZone, getModuleZone, getModuleZoneData } from './microfront-isolation-api.model';
import { once } from './once';

/**
 * Configure container to isolate global API (isolation plugins setup)
 */
export const configureIsolationContainer = once(() => {
    require('./microfront-isolation-api.storage').default(() => {
        const moduleZone = getModuleZone();
        return moduleZone ? moduleZone.name : undefined;
    });
    require('./microfront-isolation-api.style').default();
});

/**
 * Isolation API provider
 *
 * @param name - remote module name (defined in Module Federation config)
 * @param root - layout slot dedicated for this particular MF module
 * @returns isolated callback
 */
export function isolateModule(name: string) {
    const moduleZone = createModuleZone(name);
    return (callback: (params: MicroFrontParams) => any): typeof callback =>
        moduleZone.wrap(params => {
            const data = getModuleZoneData();
            data.params = params;
            return callback(params);
        }, 'isolate');
}

export function container() {
    const moduleZone = assertModuleZone();
    return <F extends Function>(callback: F): F => moduleZone.wrap(callback, callback.name || 'callback');
}

export function wrap<F extends Function>(callback: F, source: string): F {
    return assertModuleZone().wrap(callback, source);
}
