import { isolationAPI } from './microfront-isolation-api';

describe('isolationAPI', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an exception if remote module has not been loaded', () => {
        expect(() => isolationAPI({ name: 'foo' })).toThrowError('foo');
    });

    it('should bind isolation API to the loaded remote module', () => {
        (globalThis as any).foo = {};

        const api = isolationAPI({ name: 'foo' });

        expect(api).toBeTruthy();
    });

    it('should return already bound isolation API on consequent calls', () => {
        (globalThis as any).foo = {};

        const api1 = isolationAPI({ name: 'foo' });
        const api2 = isolationAPI({ name: 'foo' });

        expect(api1).toBe(api2);
    });

    it('should prepend styles into the remote module root by means of "insertStyle" function', () => {
        (globalThis as any).foo = {};
        const prepend = jest.fn();
        const root = { prepend } as any;
        const linkTag = { textContent: 'linkTag1' } as Node;

        const { insertStyle } = isolationAPI({ name: 'foo', root });
        insertStyle(linkTag);

        expect(prepend).toBeCalledWith(linkTag);
    });

    it('should reinitialize all previously inserted styles by means of "bindStyles" function', () => {
        (globalThis as any).foo = {};
        const prepend = jest.fn();
        const root = { prepend } as any;
        const linkTag1 = { textContent: 'linkTag1' } as Node;
        const linkTag2 = { textContent: 'linkTag2' } as Node;

        const { insertStyle, bindStyles } = isolationAPI({ name: 'foo', root });
        insertStyle(linkTag1);
        insertStyle(linkTag2);
        prepend.mockClear();
        bindStyles();

        expect(prepend).toBeCalledWith(linkTag1, linkTag2);
    });
});
