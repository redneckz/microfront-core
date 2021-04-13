import { container } from 'webpack';

export type ModuleFederationPluginOptions = ConstructorParameters<typeof container.ModuleFederationPlugin>[0];

const DEFAULT_ENTRY_FILENAME = 'remoteEntry.js';

// Simplified representation of remote module declaration with fixed remote entry name
type ModuleName = string;
type ModuleBaseURL = string;
export type RemoteURL = [ModuleName, ModuleBaseURL];

/**
 * Factory-function to declare basic container settings.
 * Remote entry file name is fixed as well as remote module type
 *
 * @param name - name of container is required
 * @returns options compatible with ModuleFederationPlugin
 */
export function moduleFederationOptions(options: {
    name: string;
    exposes?: ModuleFederationPluginOptions['exposes'];
    remotes?: RemoteURL[];
    shared?: ModuleFederationPluginOptions['shared'];
}): ModuleFederationPluginOptions {
    const { name, exposes, remotes } = options;
    return Object.assign(
        {
            name,
            remotes: remotes?.map(remoteURL)
        },
        exposes && {
            library: { type: 'var', name },
            // remote entry filename is standardized
            filename: DEFAULT_ENTRY_FILENAME,
            exposes
        }
    );
}

/**
 *
 * @param name - remote container name
 * @param baseURL - https://localhost:4200
 *
 * @returns foo@https://localhost:4200/remoteEntry.js
 */
function remoteURL([name, baseURL]: RemoteURL): string {
    // remote entry filename is standardized
    return `${name}@${baseURL}/${DEFAULT_ENTRY_FILENAME}`;
}
