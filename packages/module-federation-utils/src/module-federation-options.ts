import { container } from 'webpack';

export type ModuleFederationPluginOptions = ConstructorParameters<typeof container.ModuleFederationPlugin>[0];

export const DEFAULT_ENTRY_FILENAME = 'remoteEntry.js';

// Simplified representation of remote module declaration with fixed remote entry name
type ModuleName = string;
type ModuleBaseURL = string;
export type RemoteURL = [ModuleName, ModuleBaseURL];

/**
 * Factory-function to declare basic container settings.
 * Remote entry file name is fixed as well as remote module type to standardize
 *
 * @param name - name of container is required
 * @returns options compatible with ModuleFederationPlugin
 */
export function moduleFederationOptions(
    options: {
        name: string;
        exposes?: ModuleFederationPluginOptions['exposes'];
        remotes?: RemoteURL[];
    },
    rawOptions?: Partial<ModuleFederationPluginOptions>
): ModuleFederationPluginOptions {
    const { name, exposes, remotes } = options;
    return Object.assign(
        {},
        rawOptions,
        {
            name,
            remotes: remotes?.map(remoteURL)
        },
        exposes && {
            library: { type: 'var', name },
            filename: DEFAULT_ENTRY_FILENAME,
            exposes
        }
    );
}

/**
 *
 * @param name - foo
 * @param baseURL - https://localhost:4200
 *
 * @returns foo@https://localhost:4200/remoteEntry.js
 */
function remoteURL([name, baseURL]: RemoteURL): string {
    return `${name}@${baseURL}/${DEFAULT_ENTRY_FILENAME}`;
}
