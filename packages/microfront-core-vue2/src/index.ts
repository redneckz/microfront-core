import { PluginObject } from 'vue';

import { shadow } from './shadow.directive';
import { MicroFrontInShadow } from './microfront-in-shadow';

const plugin: PluginObject<{}> = {
    install(Vue) {
        Vue.directive('shadow', shadow);
        Vue.component('MicroFrontInShadow', MicroFrontInShadow);
    }
};

// Vue.use()
export default plugin;

// To allow individual component use, export components
// each can be registered via Vue.component()
export { shadow, MicroFrontInShadow };
