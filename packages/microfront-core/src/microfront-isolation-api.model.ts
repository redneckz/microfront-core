import { MicroFrontParams } from './microfront-api.model';
import { MicroFrontEvent } from './microfront-api.events';

export interface ModuleZoneData {
    params?: MicroFrontParams;
    styles?: Node[];
    listeners?: { [key in MicroFrontEvent]: Function[] };
}
