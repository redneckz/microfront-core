import { proxy } from './proxy';
import { insertStyle } from './insert-style';
import { isStyleNode } from './is-style-node';
import { getModuleZone, getModuleZoneData } from './microfront-isolation-api.model';
import { fireMicroFrontEvent } from './microfront-api.events';

/**
 * Isolation API plugin to isolate styles inserted by micro frontend.
 * Styles created by MF should be moved from head to shadow root of the corresponding MF
 *
 */
export default () => {
    proxy(globalThis.document, {
        createElement: (createElement, ...args) => {
            const node = createElement(...args);
            // Pre-filter produced nodes to reduce memory usage
            const zone = getModuleZone();
            if (zone && isStyleNode(node, { relaxed: true })) {
                requestAnimationFrame(moveStyleFromHeadToMFRoot(node, zone));
            }
            return node;
        }
    });
};

function moveStyleFromHeadToMFRoot(style: Node, zone: Zone): () => void {
    return zone.wrap(() => {
        if (!isStyleNode(style) || style.parentNode !== document.head) return;

        insertStyle(style, {
            fallback: () => {} // no fallback
        });
        fireMicroFrontEvent('style_mounted', { style });
    }, 'moveStyleFromHeadToMFRoot');
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
