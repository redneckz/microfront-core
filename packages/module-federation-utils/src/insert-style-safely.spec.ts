import { insertStyleSafely } from './insert-style-safely';

describe('insertStyleSafely', () => {
    afterEach(() => {
        globalThis.document = {} as any;
    });

    it('should inject styles into document`s head in context of standalone app (outside of MF containers stuff)', () => {
        globalThis.document = {
            head: {
                appendChild: jest.fn()
            }
        } as any;
        const linkTag: Node = {} as any;

        insertStyleSafely('foo')(linkTag);

        expect(document.head.appendChild).toBeCalledWith(linkTag);
    });

    it('should inject styles into MF mounting root in context of MF container', () => {
        // Setup MF context
        (globalThis as any).foo = {
            insertStyle: jest.fn()
        } as any;
        const linkTag: Node = {} as any;

        insertStyleSafely('foo')(linkTag);

        expect((globalThis as any).foo.insertStyle).toBeCalledWith(linkTag, undefined);
    });

    it('should inject styles into MF mounting root with additional options if provided', () => {
        // Setup MF context
        (globalThis as any).foo = {
            insertStyle: jest.fn()
        } as any;
        const linkTag: Node = {} as any;

        insertStyleSafely('foo', { rootClass: 'root-class' })(linkTag);

        expect((globalThis as any).foo.insertStyle).toBeCalledWith(linkTag, { rootClass: 'root-class' });
    });
});
