import { proxy } from './proxy';
import { insertStyle } from './insert-style';
import { isStyleNode } from './is-style-node';
import { fireMicroFrontEvent } from './microfront-api.events';

/**
 * Isolation API plugin to isolate styles inserted by micro frontend.
 * Styles created by MF should be moved from head to shadow root of the corresponding MF
 *
 * @param targetNode - document.head by default
 */
export default (targetNode?: Node) => {
    if (!('MutationObserver' in globalThis)) {
        console.warn('MutationObserver is not supported. Manual setup is needed for styles isolation.');
        return;
    }

    const style2Zone = trackZonesOfCreatedStyles();

    const observer = new MutationObserver(moveAddedStylesToCorrespondingMFs(style2Zone));
    observer.observe(targetNode || document.head, {
        childList: true,
        attributes: false,
        subtree: false
    });
};

function trackZonesOfCreatedStyles(): Map<Node, Zone> {
    const style2Zone = new Map<Node, Zone>();

    proxy(globalThis.document, {
        createElement: (createElement, ...args) => {
            const node = createElement(...args);
            // Pre-filter produced nodes to reduce memory usage
            if (isStyleNode(node, { relaxed: true })) {
                style2Zone.set(node, Zone.current);
                fireMicroFrontEvent('style_fetched', { style: node });
            }
            return node;
        }
    });

    return style2Zone;
}

function moveAddedStylesToCorrespondingMFs(style2Zone: Map<Node, Zone>): MutationCallback {
    return mutationsList => {
        const nodes = mutationsList.map(({ addedNodes }) => addedNodes).flatMap(nodeList2array);
        const styleNodes = nodes.filter(_ => isStyleNode(_)).filter(_ => style2Zone.has(_));
        styleNodes.forEach(_ => {
            const zone = style2Zone.get(_)!;
            insertStyle(_, {
                fallback: () => {}, // no fallback
                zone
            });
            zone.run(() => fireMicroFrontEvent('style_mounted', { style: _ }));
        });
    };
}

function nodeList2array(list: NodeList): Node[] {
    const result: Node[] = [];
    list.forEach(_ => result.push(_));
    return result;
}
