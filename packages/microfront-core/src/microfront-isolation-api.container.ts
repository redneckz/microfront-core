import { once } from './once';

/**
 * Configure container to isolate global API
 */
const configureContainer = once(() => {
    require('zone.js');
    require('./microfront-isolation-api.storage').default(() => (isMicroFrontZone() ? Zone.current.name : undefined));
});

/**
 * Container provider to isolate global API relative to micro frontend instance
 *
 * @param name - remote module name (defined in Module Federation config)
 * @param task - task to execute in isolation
 */
export function container({ name }: { name: string }) {
    let zone: Zone | undefined;
    return (task: () => void): void => {
        configureContainer();
        if (!zone) {
            zone = forkMicroFrontZone({ name });
        }
        zone.run(task);
    };
}

function isMicroFrontZone(): boolean {
    return Boolean((globalThis as any).Zone && Zone.current.get('microfront'));
}

function forkMicroFrontZone({ name }: { name: string }): Zone {
    return Zone.current.fork({ name, properties: { microfront: true } });
}
