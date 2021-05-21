import '@redneckz/microfront-core/lib/configure';

import { createApp } from 'vue';
import App from './App.vue';
import microfront from '@redneckz/microfront-core-vue';

createApp(App).use(microfront).mount('#app');
