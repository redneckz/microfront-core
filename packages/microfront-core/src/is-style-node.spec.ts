import { isStyleNode } from './is-style-node';

describe('isStyleNode', () => {
    it('should return true for <style></style>', () => {
        expect(isStyleNode({ nodeName: 'STYLE' } as HTMLStyleElement)).toBe(true);
    });

    it('should return true for <link rel="stylesheet"></link>', () => {
        expect(isStyleNode({ nodeName: 'LINK', rel: 'stylesheet' } as HTMLLinkElement)).toBe(true);
    });

    it('should return false for anything else', () => {
        expect(isStyleNode({ nodeName: 'DIV' } as HTMLDivElement)).toBe(false);
    });
});
