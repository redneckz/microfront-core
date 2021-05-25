const PROXIED = '__microfront__proxied__';

/**
 * Proxy with monkey patching
 * ! No intention to polyfill and use native Proxy API (looks like overkill)
 *
 * @param target
 * @param proxy
 * @returns monkey patched (mutated) target
 */
export function proxy<
    T extends Record<string, any>,
    P extends Partial<
        {
            [K in keyof T]: (
                delegate: (...proxiedArgs: Parameters<T[K]>) => ReturnType<T[K]>,
                ...args: Parameters<T[K]>
            ) => ReturnType<T[K]>;
        }
    >
>(target: T, proxy: P): T {
    if (!target || isProxied(target)) return target;

    const proxied: Set<any> = (globalThis as any)[PROXIED] || new Set();
    (globalThis as any)[PROXIED] = proxied;
    proxied.add(target);

    Object.keys(proxy).forEach((k: keyof T) => {
        const proxiedMehtod = proxy[k] as Function;
        const originalMethod = target[k] as Function;
        target[k] = function (this: T, ...args: any[]) {
            const delegate = (...proxiedArgs: any[]) => originalMethod.call(this, ...proxiedArgs);
            return proxiedMehtod.call(this, delegate, ...args);
        } as T[keyof T];
    });
    return target;
}

export function isProxied(target: any): boolean {
    const proxied: Set<any> = (globalThis as any)[PROXIED];
    return proxied && proxied.has(target);
}
