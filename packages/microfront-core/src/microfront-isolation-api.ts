import { MicroFrontParams } from './microfront-api.model';
import { once } from './once';

/**
 * Configure container to isolate global API
 */
const configureIsolationContainer = once(() => {
    require('./microfront-isolation-api.storage').default(() => {
        const moduleZone = getModuleZone();
        return moduleZone ? moduleZone.name : undefined;
    });
});

interface ModuleZoneData {
    params?: MicroFrontParams;
    styles?: Node[];
}

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
            configureIsolationContainer();
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

export function bindStyles(): void {
    const { params: { root } = {}, styles = [] } = getModuleZoneData();
    if (!root) throw new Error('Trying to bind styles outside of micro frontend context');

    root.prepend(...styles);
}

export function unbindStyles(): void {
    const { params: { root } = {}, styles = [] } = getModuleZoneData();
    if (!root) throw new Error('Trying to unbind styles outside of micro frontend context');

    styles.forEach(_ => root.removeChild(_));
}

/**
 * This function should be self-sufficient (other functions can not be used here),
 * cause it supposed to be used inside Webpack config
 * */
export function insertStyle(
    style: Node,
    fallback: (style: Node) => any = style => {
        document.head.appendChild(style);
    }
) {
    try {
        // Inlined
        const data: ModuleZoneData = Zone.current.getZoneWith('microfront')?.get('data');
        const { params: { root } = {} } = data;
        root!.prepend(style);
        if (!data.styles) data.styles = [];
        data.styles.push(style);
    } catch (err) {
        console.warn(err);
        fallback(style);
    }
}

export function getMicroFrontParams(): MicroFrontParams | undefined {
    return getModuleZoneData().params;
}

function createModuleZone(name: string): Zone {
    return Zone.current.fork({ name, properties: { microfront: true, data: {} as ModuleZoneData } });
}

function getModuleZone(): Zone | null {
    return Zone.current.getZoneWith('microfront');
}

function getModuleZoneData(): ModuleZoneData {
    return assertModuleZone().get('data');
}

function assertModuleZone(): Zone {
    const moduleZone = getModuleZone();
    if (!moduleZone) throw new Error('Please use isolation API inside micro frontend context');
    return moduleZone;
}
