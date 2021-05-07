import { App, Plugin } from 'vue';

import { shadow } from './shadow.directive';
import { MicroFrontInShadow } from './microfront-in-shadow';

// install function executed by Vue.use()
const install: Exclude<Plugin['install'], undefined> = function installMicrofrontCoreVue(app: App) {
    app.directive('shadow', shadow);
    app.component('MicroFrontInShadow', MicroFrontInShadow);
};

// Create module definition for Vue.use()
export default install;

// To allow individual component use, export components
// each can be registered via Vue.component()
export { shadow, MicroFrontInShadow };
