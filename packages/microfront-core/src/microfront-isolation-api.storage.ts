import { proxy } from './proxy';

const isProxied = '__microfront__is_proxied__';

/**
 * Isolation API plugin to isolate Storage API relative to specific micro frontend
 * @param microfrontName - current micro frontend name or undefined if called outside micro frontend
 */
export default (microfrontName: () => string | undefined) => {
    const key = namespacedKey(microfrontName);
    [globalThis.localStorage, globalThis.sessionStorage]
        .filter(storage => storage && !(storage as any)[isProxied])
        .forEach((storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>) => {
            proxy(storage, {
                getItem: (getItem, _) => getItem(key(_)),
                setItem: (setItem, _, val) => setItem(key(_), val),
                removeItem: (removeItem, _) => removeItem(key(_))
            });
            (storage as any)[isProxied] = true;
        });
};

function namespacedKey(microfrontName: () => string | undefined) {
    return (key: string) => {
        const namespace = microfrontName();
        return namespace ? `${namespace}-${key}` : key;
    };
}
