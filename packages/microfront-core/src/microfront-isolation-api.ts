const BOUND_API_FIELD = Symbol();

/**
 * Kind of internal API used by low-level modules to isolate everything in the right way ;)
 */
export interface MicroFrontIsolationAPI {
    bindStyles(): void;
    unbindStyles(): void;

    insertStyle(style: Node): void;
}

/**
 * Isolation API provider. Should bind isolation API to the loaded MF module instance
 *
 * @param name - remote module name (defined in Module Federation config)
 * @param root - layout slot dedicated for this particular MF module
 * @returns isolation API to isolate styles and other kinds of stuff related to MF module
 */
export function isolationAPI({ name, root }: { name: string; root?: Node & ParentNode }): MicroFrontIsolationAPI {
    const moduleVar = (globalThis as any)[name];
    if (!moduleVar) {
        throw new Error(`Module ${name} should be loaded in order to provide isolation API`);
    }
    if (moduleVar[BOUND_API_FIELD]) {
        return moduleVar[BOUND_API_FIELD];
    }

    const cache: { styles: Node[] } = { styles: [] };
    moduleVar[BOUND_API_FIELD] = {
        bindStyles: () => {
            if (!root) return;
            root.prepend(...cache.styles);
        },
        unbindStyles: () => {
            if (!root) return;
            cache.styles.forEach(_ => root.removeChild(_));
        },
        insertStyle: style => {
            if (!root) return;
            root.prepend(style);
            cache.styles.push(style);
        }
    } as MicroFrontIsolationAPI;

    // TODO Remove
    moduleVar.insertStyle = moduleVar[BOUND_API_FIELD].insertStyle;

    return moduleVar[BOUND_API_FIELD];
}
