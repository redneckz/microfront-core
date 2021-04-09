import { ModuleFederationPluginOptions } from './module-federation-options';

/**
 * Helper to simplify declaration of shared packages based on package.json
 *
 * {
 *   ...
 *   shared: shareScope(require('./package.json'), '@angular')
 * }
 *
 * Will produce:
 * {
 *   ...
 *   shared: {
 *     '@angular/core': { requiredVersion: '11.0.0' },
 *     '@angular/common': { requiredVersion: '11.0.0' },
 *     '@angular/router': { requiredVersion: '11.0.0' },
 *   }
 * }
 *
 * @param packageJSON - package.json contents (only dependencies are used)
 * @param scopePrefix - '@angular', for example
 * @param map - map of shared option overrides (optional)
 *
 * @returns ModuleFederationPlugin shared module option
 */
export function shareScope(
    packageJSON: { dependencies: Record<string, string> },
    scopePrefix: string = '',
    map: Exclude<ModuleFederationPluginOptions['shared'], Array<any>> = {}
): ModuleFederationPluginOptions['shared'] {
    const { dependencies } = packageJSON;
    return Object.assign(
        {},
        ...Object.keys(dependencies)
            .filter(_ => _.startsWith(scopePrefix))
            .map(dep => ({
                [dep]: map[dep] || { requiredVersion: dependencies[dep] }
            }))
    );
}
