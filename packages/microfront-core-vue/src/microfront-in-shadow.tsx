import { h, RenderFunction, Ref, defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import { MicroFrontModuleBootstrap, MicroFrontBootstrappedModule } from '@redneckz/microfront-core';

import { moveToShadow } from './shadow.directive';

export interface MicroFrontInShadowProps {
    route?: string;

    bootstrap: MicroFrontModuleBootstrap;

    // Render-props pattern...
    renderError?: (error: Error) => ReturnType<RenderFunction>;
    // Can be refactored to scoped slots
    children: (mountingRootRef: Ref) => ReturnType<RenderFunction>;
}

export const MicroFrontInShadow = defineComponent(function MicroFrontInShadow({
    route,
    bootstrap,
    renderError = defaultErrorRenderer,
    children
}: MicroFrontInShadowProps) {
    const rootRef = ref<Element>();
    const mountingRootRef = ref<Element>();

    const bootstrappedModuleRef = ref<MicroFrontBootstrappedModule>();
    const errorRef = ref<Error>();

    onMounted(async () => {
        try {
            moveToShadow(rootRef.value!);
            bootstrappedModuleRef.value = await bootstrap({ route, root: rootRef.value });
            const { mount } = bootstrappedModuleRef.value;
            await mount(mountingRootRef.value!);
        } catch (error) {
            console.error(error);
            errorRef.value = error;
        }
    });

    onBeforeUnmount(async () => {
        if (!bootstrappedModuleRef.value || !mountingRootRef.value) return;

        const { unmount } = bootstrappedModuleRef.value;
        await unmount(mountingRootRef.value);
        mountingRootRef.value = undefined;
    });

    return () => (
        <div ref={rootRef} role="document" aria-atomic="true">
            {[errorRef.value ? renderError(errorRef.value) : children(mountingRootRef)]}
        </div>
    );
});

function defaultErrorRenderer(error: Error): ReturnType<RenderFunction> {
    throw error;
}
