import { shareScope } from './share-scope';

describe('shareScope', () => {
    it('should compute ModuleFederationPlugin "shared" option according to dependencies declared in package.json', () => {
        expect(
            shareScope({
                dependencies: {
                    react: '17.0.0',
                    'react-dom': '17.0.0'
                }
            })
        ).toEqual({
            react: { requiredVersion: '17.0.0' },
            'react-dom': { requiredVersion: '17.0.0' }
        });
    });

    it('should filter dependencies by provided prefix', () => {
        expect(
            shareScope(
                {
                    dependencies: {
                        react: '17.0.0',
                        'react-dom': '17.0.0',
                        foo: '1.2.3',
                        bar: '4.5.6'
                    }
                },
                'react' // Share only react packages
            )
        ).toEqual({
            react: { requiredVersion: '17.0.0' },
            'react-dom': { requiredVersion: '17.0.0' }
        });
    });

    it('should apply custom versioning strategy for each shared package if one is provided', () => {
        expect(
            shareScope(
                {
                    dependencies: {
                        react: '17.0.0',
                        'react-dom': '17.0.0'
                    }
                },
                'react',
                {
                    'react-dom': { singleton: true }
                }
            )
        ).toEqual({
            react: { requiredVersion: '17.0.0' },
            'react-dom': { singleton: true }
        });
    });
});
