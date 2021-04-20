import { isolationAPI } from './microfront-isolation-api';

describe('isolationAPI', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should throw an exception if remote module has not been loaded', () => {
        expect(() => isolationAPI('foo')).toThrowError('foo');
    });

    it('should bind isolation API to the loaded remote module', () => {
        (globalThis as any).foo = {};

        const api = isolationAPI('foo');

        expect(api).toBeTruthy();
    });

    it('should return already bound isolation API on consequent calls', () => {
        (globalThis as any).foo = {};

        const api1 = isolationAPI('foo');
        const api2 = isolationAPI('foo');

        expect(api1).toBe(api2);
    });

    describe('container', () => {
        // Integration testing
        it('should isolate invocations of Storage API relative to micro frontend instance', () => {
            expect.assertions(3);

            // localStorage mock
            const storage: Record<string, string> = {};
            (globalThis as any).localStorage = {
                getItem: (key: string) => storage[key],
                setItem: (key: string, val: string) => {
                    storage[key] = val;
                }
            } as Storage;

            // First miro frontend
            (globalThis as any).foo = {};
            const fooAPI = isolationAPI('foo');
            fooAPI.container(() => {
                globalThis.localStorage.setItem('key', 'foo');
            });
            // Second miro frontend
            (globalThis as any).bar = {};
            const barAPI = isolationAPI('bar');
            barAPI.container(() => {
                globalThis.localStorage.setItem('key', 'bar');
            });

            fooAPI.container(() => {
                expect(globalThis.localStorage.getItem('key')).toBe('foo');
            });
            barAPI.container(() => {
                expect(globalThis.localStorage.getItem('key')).toBe('bar');
            });
            expect(storage).toEqual({ 'foo-key': 'foo', 'bar-key': 'bar' });
        });
    });

    describe('styles isolation', () => {
        it('should prepend styles into the remote module root by means of "insertStyle" function', () => {
            (globalThis as any).foo = {};
            const prepend = jest.fn();
            const root = { prepend } as any;
            const linkTag = { textContent: 'linkTag1' } as Node;

            const { insertStyle } = isolationAPI('foo', { root });
            insertStyle(linkTag);

            expect(prepend).toBeCalledWith(linkTag);
        });

        it('should reinitialize all previously inserted styles by means of "bindStyles" function', () => {
            (globalThis as any).foo = {};
            const prepend = jest.fn();
            const root = { prepend } as any;
            const linkTag1 = { textContent: 'linkTag1' } as Node;
            const linkTag2 = { textContent: 'linkTag2' } as Node;

            const { insertStyle, bindStyles } = isolationAPI('foo', { root });
            insertStyle(linkTag1);
            insertStyle(linkTag2);
            prepend.mockClear();
            bindStyles();

            expect(prepend).toBeCalledWith(linkTag1, linkTag2);
        });
    });
});
