import { PluginObject } from 'vue';

import { shadow } from './shadow.directive';
import { MicroFrontContainer } from './microfront-container';

const plugin: PluginObject<{}> = {
    install(Vue) {
        Vue.directive('shadow', shadow);
        Vue.component('MicroFrontInShadow', MicroFrontContainer);
        Vue.component('MicroFrontContainer', MicroFrontContainer);
    }
};

// Vue.use()
export default plugin;

// To allow individual component use, export components
// each can be registered via Vue.component()
export type { MicroFrontContainerProps } from './microfront-container';
export { shadow, MicroFrontContainer as MicroFrontInShadow, MicroFrontContainer };
