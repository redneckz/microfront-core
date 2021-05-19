export function isStyleNode(node: Node): boolean {
    switch (node.nodeName.toLowerCase()) {
        case 'style':
            return true;
        case 'link': {
            const link = node as HTMLLinkElement;
            return link.rel === 'stylesheet';
        }
        default:
            return false;
    }
}
