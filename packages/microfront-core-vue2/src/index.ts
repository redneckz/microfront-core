import { PluginObject } from 'vue';

import { shadow } from './shadow.directive';
import { MicroFrontInShadow } from './microfront-in-shadow';
import { MicroFrontContainer } from './microfront-container';

const plugin: PluginObject<{}> = {
    install(Vue) {
        Vue.directive('shadow', shadow);
        Vue.component('MicroFrontInShadow', MicroFrontInShadow);
        Vue.component('MicroFrontContainer', MicroFrontContainer);
    }
};

// Vue.use()
export default plugin;

// To allow individual component use, export components
// each can be registered via Vue.component()
export type { MicroFrontInShadowProps } from './microfront-in-shadow';
export type { MicroFrontContainerProps } from './microfront-container';
export { shadow, MicroFrontInShadow, MicroFrontContainer };
