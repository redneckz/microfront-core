import { moduleFederationOptions } from './module-federation-options';

describe('moduleFederationOptions', () => {
    it('should return name of module as the only required part of ModuleFederationPlugin options', () => {
        expect(moduleFederationOptions({ name: 'foo' })).toEqual({ name: 'foo' });
    });

    it('should compute "remotes" option based on simplified definition with fixed remote entry name', () => {
        expect(
            moduleFederationOptions({
                name: 'foo',
                remotes: [
                    ['bar', 'https://localhost:4201'],
                    ['baz', 'https://localhost:4202']
                ]
            })
        ).toEqual({
            name: 'foo',
            remotes: ['bar@https://localhost:4201/remoteEntry.js', 'baz@https://localhost:4202/remoteEntry.js']
        });
    });
});
