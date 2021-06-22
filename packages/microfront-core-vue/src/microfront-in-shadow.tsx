import { h, RenderFunction, PropType, defineComponent, ref, onMounted, onBeforeUnmount } from 'vue';
import {
    MicroFrontIsolation,
    MicroFrontModuleBootstrap,
    MicroFrontBootstrappedModule
} from '@redneckz/microfront-core';

import { moveToShadow } from './shadow.directive';

export interface MicroFrontInShadowProps<P extends Record<string, any> = {}> {
    route?: string;
    bootstrap: MicroFrontModuleBootstrap<P>;
    params?: P;
}

/**
 * Available slots:
 * default: (mountingRootRef: Ref) => VNodeList;
 * error?: (error: Error) => VNodeList;
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
        },
        params: {
            type: Object as PropType<MicroFrontInShadowProps['params']>,
            required: false
        }
    },
    setup(props: MicroFrontInShadowProps, { slots }) {
        const { isolationType = MicroFrontIsolation.SHADOW } = props.bootstrap;

        const rootRef = ref<Element>();
        const mountingRootRef = ref<Element>();

        const bootstrappedModuleRef = ref<MicroFrontBootstrappedModule>();
        const errorRef = ref<Error>();

        onMounted(async () => {
            try {
                let root: ParentNode & Node = rootRef.value!;
                if (isolationType === MicroFrontIsolation.SHADOW) {
                    root = moveToShadow(rootRef.value!);
                }
                bootstrappedModuleRef.value = await props.bootstrap({
                    route: props.route,
                    root,
                    ...props.params
                });
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
