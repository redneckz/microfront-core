export enum MicroFrontIsolation {
    SHADOW, // default
    SANDBOX, // not supported yet
    NONE = 2
}

// Revealed API provided by host container
export interface MicroFrontParams {
    readonly route?: string; // MF root route
    readonly root?: ParentNode & Node; // layout slot dedicated for this particular MF module
}

interface WithIsolation {
    container<F extends Function>(callback: F): F;
}

export interface MicroFrontBootstrappedModule {
    mount(mountingRoot: Element): Promise<void>;
    unmount(mountingRoot: Element): Promise<void>;
}

export type MicroFrontBootstrappedModuleWithIsolation = MicroFrontBootstrappedModule & WithIsolation;

export interface MicroFrontModuleBootstrap<MiscParams extends Record<string, any> = {}, ModuleExtension = {}> {
    (params: MicroFrontParams & MiscParams): Promise<MicroFrontBootstrappedModule & ModuleExtension>;
    isolationType?: MicroFrontIsolation;
}

export type MicroFrontModuleBootstrapWithIsolation<
    MiscParams extends Record<string, any> = {}
> = MicroFrontModuleBootstrap<MiscParams, WithIsolation>;

// This interface should be implemented by remote modules
export interface MicroFrontModule<MiscParams extends Record<string, any> = {}> {
    bootstrap: MicroFrontModuleBootstrap<MiscParams>;
}
