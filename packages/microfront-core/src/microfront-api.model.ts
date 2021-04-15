export enum MicroFrontIsolation {
    SHADOW, // default
    SANDBOX // not supported yet
}

// Revealed API provided by host container
export interface MicroFrontAPI {
    readonly route?: string; // MF root route
    readonly root?: ParentNode & Node; // layout slot dedicated for this particular MF module

    // TODO v1 messaging
}

export interface MicroFrontBootstrappedModule {
    mount(mountingRoot: Element): Promise<void>;
    unmount(mountingRoot: Element): Promise<void>;
}

export type MicroFrontModuleBootstrap = (api: MicroFrontAPI) => Promise<MicroFrontBootstrappedModule>;

// This interface should be implemented by remote modules
export interface MicroFrontModule {
    bootstrap: MicroFrontModuleBootstrap;
}
