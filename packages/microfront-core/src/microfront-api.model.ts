export enum MicroFrontIsolation {
    SHADOW, // default
    SANDBOX // not supported yet
}

// Revealed API provided by host container
export interface MicroFrontParams {
    readonly route?: string; // MF root route
    readonly root?: ParentNode & Node; // layout slot dedicated for this particular MF module
}

export interface MicroFrontBootstrappedModule {
    mount(mountingRoot: Element): Promise<void>;
    unmount(mountingRoot: Element): Promise<void>;
}

export type MicroFrontModuleBootstrap<MiscParams extends Record<string, any> = {}> = (
    params: MicroFrontParams & MiscParams
) => Promise<MicroFrontBootstrappedModule>;

// This interface should be implemented by remote modules
export interface MicroFrontModule<MiscParams extends Record<string, any> = {}> {
    bootstrap: MicroFrontModuleBootstrap<MiscParams>;
}
