import { once } from './once';

describe('once', () => {
    it('should produce delegating function', () => {
        expect.assertions(2);

        const foo = jest.fn((_: string) => _);
        const wrappedFoo = once(foo);

        expect(wrappedFoo('123')).toBe('123');
        expect(foo).toBeCalledWith('123');
    });

    it('should delegate the first call only and return cached result for all consequent calls', () => {
        expect.assertions(2);

        const foo = jest.fn((_: string) => _);
        const wrappedFoo = once(foo);
        wrappedFoo('123');

        expect(wrappedFoo('456')).toBe('123');
        expect(foo).toBeCalledTimes(1);
    });
});
