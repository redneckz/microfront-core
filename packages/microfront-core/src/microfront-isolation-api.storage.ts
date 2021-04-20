import { proxy } from './proxy';

/**
 * Isolation API plugin to isolate Storage API relative to specific micro frontend
 * @param microfrontName - current micro frontend name or undefined if called outside micro frontend
 */
export default (microfrontName: () => string | undefined) => {
    const key = namespacedKey(microfrontName);
    [globalThis.localStorage, globalThis.sessionStorage]
        .filter(Boolean)
        .forEach((storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>) => {
            proxy(storage, {
                getItem: (getItem, _) => getItem(key(_)),
                setItem: (setItem, _, val) => setItem(key(_), val),
                removeItem: (removeItem, _) => removeItem(key(_))
            });
        });
};

function namespacedKey(microfrontName: () => string | undefined) {
    return (key: string) => {
        const namespace = microfrontName();
        return namespace ? `${namespace}-${key}` : key;
    };
}
