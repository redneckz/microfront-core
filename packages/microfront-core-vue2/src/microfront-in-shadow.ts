import { PropType, defineComponent, ref, onMounted, onBeforeUnmount } from '@vue/composition-api';
import { MicroFrontModuleBootstrap, MicroFrontBootstrappedModule } from '@redneckz/microfront-core';

import { moveToShadow } from './shadow.directive';
import { VNode } from 'vue';

export interface MicroFrontInShadowProps<P extends Record<string, any> = {}> {
    parentRef?: string; // TODO See dirty hack below
    route?: string;
    bootstrap: MicroFrontModuleBootstrap<P>;
    params?: P;
}

/**
 * Available slots:
 * default: () => VNodeList;
 * error?: (error: Error) => VNodeList;
 */
export const MicroFrontInShadow = defineComponent({
    props: {
        parentRef: {
            type: String as PropType<MicroFrontInShadowProps['parentRef']>,
            required: false,
            default: 'mountingRoot'
        },
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
    /**
     * @param props
     * @param slots
     * @param parent - have to use deprecated API cause of absence of ref as a function in Vue2
     */
    setup(props: MicroFrontInShadowProps, { slots, parent }) {
        const rootRef = ref<Element>();
        // TODO Dirty hack because of "absence of ref as a function in Vue2". See microfront-core-vue (Vue3) for sane implementation
        // TODO Find out proper solution to avoid usage of deprecated "parent"
        const mountingRootRef = () => parent?.$refs[props.parentRef || 'mountingRoot'] as Element | undefined;

        const bootstrappedModuleRef = ref<MicroFrontBootstrappedModule>();
        const errorRef = ref<Error>();

        onMounted(async () => {
            try {
                moveToShadow(rootRef.value!);
                bootstrappedModuleRef.value = await props.bootstrap({
                    route: props.route,
                    root: rootRef.value,
                    ...props.params
                });
                const { mount } = bootstrappedModuleRef.value;
                await mount(mountingRootRef()!);
            } catch (error) {
                console.error(error);
                errorRef.value = error;
            }
        });

        onBeforeUnmount(async () => {
            if (!bootstrappedModuleRef.value || !mountingRootRef()) return;

            const { unmount } = bootstrappedModuleRef.value;
            await unmount(mountingRootRef()!);
        });

        const renderError = () => (slots.error || defaultErrorRenderer)(errorRef.value);
        const children = () => slots.default!();

        return {
            // State
            root: rootRef,
            // Methods
            children: () => (errorRef.value ? renderError() : children())
        };
    },
    render(h) {
        // Very strange behavior of TS forced me to add the following weird statement ;)
        const childs: VNode[] = this.children()!;
        return h(
            'div',
            {
                ref: 'root',
                attrs: {
                    role: 'document',
                    'aria-atomic': 'true'
                }
            },
            childs
        );
    }
});

function defaultErrorRenderer(error?: Error): undefined {
    throw error;
}
