import './configure';

import {
    configureIsolationContainer,
    isolateModule,
    bindStyles,
    unbindStyles,
    container
} from './microfront-isolation-api';
import { insertStyle } from './insert-style';

jest.mock('./once', () => ({
    once: <F extends Function>(fn: F): F => fn
}));

describe('isolateModule', () => {
    beforeEach(() => {
        // Silent warnings
        console.warn = () => {};
        (globalThis as any).document = {} as Document;
        delete (globalThis as any).localStorage;
        delete (globalThis as any).MutationObserver;
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
            it('should prepend styles into the remote module root by means of "insertStyle" function', () => {
                const prepend = jest.fn();
                const root = { prepend } as any;
                const linkTag = { textContent: 'linkTag1' } as Node;

                const bootstrapFoo = isolateModule('foo')(() => {
                    insertStyle(linkTag);
                });
                bootstrapFoo({ root });

                expect(prepend).toBeCalledWith(linkTag);
            });

            it('should reinitialize all previously inserted styles by means of "bindStyles" function (preserving order)', () => {
                const prepend = jest.fn();
                const root = { prepend } as any;
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
                const root = { prepend: () => {}, removeChild } as any;
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
                (globalThis as any).document = {
                    head: {},
                    createElement: (tagName: string) => ({ nodeName: tagName.toUpperCase() } as HTMLElement)
                } as Document;
                // MutationObserver mock
                let mutationCallback: MutationCallback;
                (globalThis as any).MutationObserver = class {
                    constructor(_: MutationCallback) {
                        mutationCallback = _;
                    }
                    observe() {}
                };
                // Re-init isolation container
                configureIsolationContainer();
                // MF root node mock
                const prepend = jest.fn();
                const root = { prepend } as any;

                let styleNode;
                const bootstrapFoo = isolateModule('foo')(() => {
                    // Create style under isolation
                    styleNode = document.createElement('style');
                });
                bootstrapFoo({ root });
                mutationCallback!([{ addedNodes: [styleNode] as any } as MutationRecord], {} as any);

                expect(prepend).toBeCalledWith(styleNode);
            });
        });
    });
});
