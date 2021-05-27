import { getModuleZoneData } from './microfront-isolation-api.model';

interface MicroFrontEventMap {
    fetched: { name: string };
    bootstrapped: { name: string };
    mounted: { name: string; mountingRoot: Element };
    unmounted: { name: string; mountingRoot: Element };
    style_mounted: { style: Node };
}

export type MicroFrontEvent = keyof MicroFrontEventMap;

export function addMicroFrontListener<E extends MicroFrontEvent>(
    type: E,
    listener: (event: MicroFrontEventMap[E]) => any
): void {
    const listeners = provideListeners(type);
    listeners.push(listener);
}

export function removeMicroFrontListener<E extends MicroFrontEvent>(
    type: E,
    listener: (event: MicroFrontEventMap[E]) => any
): void {
    const listeners = provideListeners(type);
    const index = listeners.indexOf(listener);
    if (index !== -1) {
        listeners.splice(index, 1);
    }
}

export function fireMicroFrontEvent<E extends MicroFrontEvent>(type: E, event: MicroFrontEventMap[E]): void {
    for (const listener of provideListeners(type)) {
        try {
            listener(event);
        } catch (ex) {
            console.warn(ex);
        }
    }
}

function provideListeners<E extends MicroFrontEvent>(type: E): Function[] {
    try {
        const data = getModuleZoneData();
        if (!data.listeners) {
            data.listeners = {
                fetched: [],
                bootstrapped: [],
                mounted: [],
                unmounted: [],
                style_mounted: []
            };
        }
        return data.listeners[type];
    } catch (ex) {
        // No listeners outside of microfront context
    }
    return [];
}
