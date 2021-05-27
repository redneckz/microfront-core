import { MicroFrontParams } from './microfront-api.model';
import { MicroFrontEvent } from './microfront-api.events';

export interface ModuleZoneData {
    params?: MicroFrontParams;
    styles?: Node[];
    listeners?: { [key in MicroFrontEvent]: Function[] };
}

export function getMicroFrontParams(): MicroFrontParams | undefined {
    return getModuleZoneData().params;
}

export function getModuleZoneData(): ModuleZoneData {
    return assertModuleZone().get('data');
}

export function createModuleZone(name: string): Zone {
    return Zone.current.fork({ name, properties: { microfront: true, data: {} as ModuleZoneData } });
}

export function getModuleZone(): Zone | null {
    return Zone.current.getZoneWith('microfront');
}

export function assertModuleZone(): Zone {
    const moduleZone = getModuleZone();
    if (!moduleZone) throw new Error('Please use isolation API inside micro frontend context');
    return moduleZone;
}
