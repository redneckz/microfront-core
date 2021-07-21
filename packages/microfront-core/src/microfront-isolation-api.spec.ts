import 'zone.js';
import { configureIsolationContainer, isolateModule, container } from './microfront-isolation-api';
import { bindStyles, unbindStyles } from './microfront-isolation-api.style';
import { insertStyle } from './insert-style';

jest.mock('./once', () => ({
    once: <F extends Function>(fn: F): F => fn
}));

jest.mock('./microfront-api.events', () => ({
    fireMicroFrontEvent: () => {}
}));

describe('isolateModule', () => {
    beforeEach(() => {
        // Silent warnings
        console.warn = () => {};
        (globalThis as any).document = {} as Document;
        delete (globalThis as any).localStorage;
        delete (globalThis as any).requestAnimationFrame;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('container', () => {
        // Integration testing
        it('should produce wrapper to isolate arbitrary callbacks', () => {
            expect.assertions(1);

            let wrap: ReturnType<typeof container> | undefined = undefined;
            // First micro frontend
            const bootstrapFoo = isolateModule('foo')(() => {
                wrap = container();
            });
            bootstrapFoo({});

            if (wrap) {
                (wrap as ReturnType<typeof container>)(() => {
                    expect(Zone.current.name).toBe('foo');
                })();
            }
        });
    });

    describe('global API isolation', () => {
        // Integration testing
        it('should isolate invocations of Storage API relative to micro frontend instance', () => {
            expect.assertions(5);

            // localStorage mock
            const storage: Record<string, string> = {};
            (globalThis as any).localStorage = {
                getItem: (key: string) => storage[key],
                setItem: (key: string, val: string) => {
                    storage[key] = val;
                }
            } as Storage;
            // Re-init isolation container
            configureIsolationContainer();

            // First micro frontend
            const bootstrapFoo = isolateModule('foo')(() => {
                expect(globalThis.localStorage.getItem('key')).toBe(undefined);
                globalThis.localStorage.setItem('key', 'foo');
                expect(globalThis.localStorage.getItem('key')).toBe('foo');
            });
            bootstrapFoo({});
            // Second micro frontend
            const bootstrapBar = isolateModule('bar')(() => {
                expect(globalThis.localStorage.getItem('key')).toBe(undefined);
                globalThis.localStorage.setItem('key', 'bar');
                expect(globalThis.localStorage.getItem('key')).toBe('bar');
            });
            bootstrapBar({});

            expect(storage).toEqual({ 'foo-key': 'foo', 'bar-key': 'bar' });
        });
    });

    describe('styles isolation', () => {
        describe('manual', () => {
            it('should append styles into the remote module root by means of "insertStyle" function', () => {
                const append = jest.fn();
                const root = { append } as any;
                const linkTag = { textContent: 'linkTag1' } as Node;

                const bootstrapFoo = isolateModule('foo')(() => {
                    insertStyle(linkTag);
                });
                bootstrapFoo({ root });

                expect(append).toBeCalledWith(linkTag);
            });

            it('should reinitialize all previously inserted styles by means of "bindStyles" function (preserving order)', () => {
                const append = jest.fn();
                const prepend = jest.fn();
                const root = { append, prepend } as any;
                const linkTag1 = { textContent: 'linkTag1' } as Node;
                const linkTag2 = { textContent: 'linkTag2' } as Node;

                const bootstrapFoo = isolateModule('foo')(() => {
                    insertStyle(linkTag1);
                    insertStyle(linkTag2);
                    prepend.mockClear();
                    bindStyles();
                });
                bootstrapFoo({ root });

                expect(prepend).toBeCalledWith(linkTag1, linkTag2);
            });

            it('should remove all previously inserted styles by means of "unbindStyles" function', () => {
                expect.assertions(2);

                const removeChild = jest.fn();
                const root = { append: () => {}, removeChild } as any;
                const linkTag1 = { textContent: 'linkTag1' } as Node;
                const linkTag2 = { textContent: 'linkTag2' } as Node;

                const bootstrapFoo = isolateModule('foo')(() => {
                    insertStyle(linkTag1);
                    insertStyle(linkTag2);
                    unbindStyles();
                });
                bootstrapFoo({ root });

                expect(removeChild).toBeCalledWith(linkTag1);
                expect(removeChild).toBeCalledWith(linkTag2);
            });
        });

        describe('auto', () => {
            it('should move styles created by MF to the corresponding shadow root automatically', () => {
                // Document mock
                const head = {};
                (globalThis as any).document = {
                    head,
                    createElement: (tagName: string) =>
                        ({ nodeName: tagName.toUpperCase(), parentNode: head } as HTMLElement)
                } as Document;
                (globalThis as any).requestAnimationFrame = (callback: () => any) => callback();
                // Re-init isolation container
                configureIsolationContainer();
                // MF root node mock
                const append = jest.fn();
                const root = { append } as any;

                let styleNode;
                const bootstrapFoo = isolateModule('foo')(() => {
                    // Create style under isolation
                    styleNode = document.createElement('style');
                });
                bootstrapFoo({ root });

                expect(append).toBeCalledWith(styleNode);
            });
        });
    });
});
