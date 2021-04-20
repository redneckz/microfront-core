import { proxy } from './proxy';

describe('proxy', () => {
    it('should proxy target methods by means of handlers specified in proxy object', () => {
        expect.assertions(2);

        const foo = jest.fn((_: string) => _);
        const target = { foo };

        const proxied = proxy(target, {
            foo: (delegate, _) => delegate(`**${_}**`)
        });
        const result = proxied.foo('Foo');

        expect(result).toBe('**Foo**');
        expect(foo).toBeCalledWith('**Foo**');
    });

    it('should bind all proxied methods to target object', () => {
        const foo = jest.fn((_: string) => _);
        const target = { foo };

        const proxied = proxy(target, {
            foo: (delegate, _) => delegate(_)
        });
        proxied.foo('Foo');

        expect(foo.mock.instances[0]).toBe(target);
    });

    it('should return mutated but equal by reference target', () => {
        const target = {};

        expect(proxy(target, {})).toBe(target);
    });

    it('should wrap only proxied methods', () => {
        expect.assertions(2);

        const foo = (_: string) => _;
        const bar = (_: number): number => _;
        const target = { foo, bar };

        const proxied = proxy(target, {
            bar: (delegate, _) => delegate(_)
        });

        expect(proxied.foo).toBe(foo);
        expect(proxied.bar).not.toBe(bar);
    });
});
