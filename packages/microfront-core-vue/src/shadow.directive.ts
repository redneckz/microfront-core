import { Directive } from 'vue';

export const shadow: Directive<Element> = {
    beforeMount(rootEl: Element) {
        moveToShadow(rootEl, rootEl.childNodes);
    }
};

export function moveToShadow(rootEl: Element, childNodes: NodeList = rootEl.childNodes): ShadowRoot {
    if (rootEl.shadowRoot) return rootEl.shadowRoot;

    const fragment = document.createDocumentFragment();
    childNodes.forEach(_ => fragment.appendChild(_));

    const shadowRoot = rootEl.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(fragment);
    return shadowRoot;
}
