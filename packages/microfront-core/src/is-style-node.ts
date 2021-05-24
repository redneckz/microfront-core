export function isStyleNode(node: Node, { relaxed }: { relaxed?: boolean } = {}): boolean {
    switch (node.nodeName.toLowerCase()) {
        case 'style':
            return true;
        case 'link': {
            const link = node as HTMLLinkElement;
            return relaxed || link.rel === 'stylesheet';
        }
        default:
            return false;
    }
}
