import { moduleFederationOptions } from './module-federation-options';

describe('moduleFederationOptions', () => {
    it('should return name of module as the only required part of ModuleFederationPlugin options', () => {
        expect(moduleFederationOptions({ name: 'foo' })).toEqual({ name: 'foo' });
    });

    it('should compute ModuleFederationPlugin "remotes" option based on simplified definition with fixed remote entry name', () => {
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

    it('should generate ModuleFederationPlugin "library" and "filename" options if something exposed by module', () => {
        expect(
            moduleFederationOptions({
                name: 'foo',
                exposes: {
                    './module': './src/app/foo.module.ts'
                }
            })
        ).toEqual({
            name: 'foo',
            // Module should be exposed as a var to support a wide variety of runtime contexts
            library: { type: 'var', name: 'foo' },
            filename: 'remoteEntry.js',
            exposes: {
                './module': './src/app/foo.module.ts'
            }
        });
    });
});
