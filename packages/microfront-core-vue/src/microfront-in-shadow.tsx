import { h, RenderFunction, PropType, defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import { MicroFrontModuleBootstrap, MicroFrontBootstrappedModule } from '@redneckz/microfront-core';

import { moveToShadow } from './shadow.directive';

export interface MicroFrontInShadowProps {
    route?: string;
    bootstrap: MicroFrontModuleBootstrap;
}

/**
 * Available slots:
 * error?: (error: Error) => VNodeList;
 * children: (mountingRootRef: Ref) => VNodeList;
 */
export const MicroFrontInShadow = defineComponent({
    props: {
        route: {
            type: String as PropType<MicroFrontInShadowProps['route']>,
            required: false
        },
        bootstrap: {
            type: Function as PropType<MicroFrontInShadowProps['bootstrap']>,
            required: true
        }
    },
    setup(props: MicroFrontInShadowProps, { slots }) {
        const rootRef = ref<Element>();
        const mountingRootRef = ref<Element>();

        const bootstrappedModuleRef = ref<MicroFrontBootstrappedModule>();
        const errorRef = ref<Error>();

        onMounted(async () => {
            try {
                moveToShadow(rootRef.value!);
                bootstrappedModuleRef.value = await props.bootstrap({ route: props.route, root: rootRef.value });
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

        const renderError = () => (slots.error || defaultErrorRenderer)(errorRef.value);
        const children = () => slots.default!(mountingRootRef);

        return () => (
            <div ref={rootRef} role="document" aria-atomic="true">
                {[errorRef.value ? renderError() : children()]}
            </div>
        );
    }
});

function defaultErrorRenderer(error?: Error): ReturnType<RenderFunction> {
    throw error;
}
