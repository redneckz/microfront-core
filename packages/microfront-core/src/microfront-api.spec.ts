import { register } from './microfront-api';
import { MicroFrontAPI, MicroFrontModule } from './microfront-api.model';
import { isolationAPI } from './microfront-isolation-api';

jest.mock('./microfront-isolation-api', () => ({
    isolationAPI: jest.fn(() => ({
        bindStyles: jest.fn(() => {}),
        unbindStyles: jest.fn(() => {})
    }))
}));

describe('register', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should load MF module on bootstrap', async () => {
        const module = jest.fn(() =>
            Promise.resolve<MicroFrontModule>({
                bootstrap: () => Promise.resolve({})
            } as any)
        );

        const wrappedBootstrap = register(module);
        await wrappedBootstrap({} as any);

        expect(module).toBeCalledTimes(1);
    });

    it('should load MF module on bootstrap and delegate call to the original module`s "bootstrap" function', async () => {
        const bootstrapMock = jest.fn(() => Promise.resolve({}));
        const module = () => Promise.resolve<MicroFrontModule>({ bootstrap: bootstrapMock } as any);
        const api: MicroFrontAPI = {} as any;

        const bootstrap = register(module);
        await bootstrap(api);

        expect(bootstrapMock).toBeCalledWith(api);
    });

    it('should delegate call to "mount" function of bootstrapped module', async () => {
        const mountMock = jest.fn();
        const bootstrapMock = () => Promise.resolve({ mount: mountMock });
        const module = () => Promise.resolve<MicroFrontModule>({ bootstrap: bootstrapMock } as any);
        const mountingRoot: Element = {} as any;

        const bootstrap = register(module);
        const { mount } = await bootstrap({} as any);
        await mount(mountingRoot);

        expect(mountMock).toBeCalledWith(mountingRoot);
    });

    it('should delegate call to "unmount" function of bootstrapped module', async () => {
        const unmountMock = jest.fn();
        const bootstrapMock = () => Promise.resolve({ unmount: unmountMock });
        const module = () => Promise.resolve<MicroFrontModule>({ bootstrap: bootstrapMock } as any);
        const mountingRoot: Element = {} as any;

        const bootstrap = register(module);
        const { unmount } = await bootstrap({} as any);
        await unmount(mountingRoot);

        expect(unmountMock).toBeCalledWith(mountingRoot);
    });

    it('should instantiate isolation API on "mount"', async () => {
        const mountMock = () => {};
        const bootstrapMock = () => Promise.resolve({ mount: mountMock });
        const module = () => Promise.resolve<MicroFrontModule>({ bootstrap: bootstrapMock } as any);
        const api: MicroFrontAPI = {} as any;

        const bootstrap = register(module);
        const { mount } = await bootstrap(api);
        await mount({} as any);

        expect(isolationAPI).toBeCalledWith(api);
    });

    it('should bind styles on "mount" by means of isolation API', async () => {
        const mountMock = () => {};
        const bootstrapMock = () => Promise.resolve({ mount: mountMock });
        const module = () => Promise.resolve<MicroFrontModule>({ bootstrap: bootstrapMock } as any);

        const bootstrap = register(module);
        const { mount } = await bootstrap({} as any);
        await mount({} as any);

        const [
            {
                value: { bindStyles }
            }
        ] = (isolationAPI as any).mock.results;

        expect(bindStyles).toBeCalledTimes(1);
    });
});
