<template>
    <Layout>
        <template v-slot:header>
            <MicroFrontInShadow :bootstrap="bootstrapHeader" v-slot="mountingRootRef">
                <div :ref="mountingRootRef">Loading...</div>
            </MicroFrontInShadow>
        </template>
        <template v-slot>
            <MicroFrontInShadow :bootstrap="bootstrapAds" v-slot="mountingRootRef">
                <div :ref="mountingRootRef">Loading...</div>
            </MicroFrontInShadow>
        </template>
        <template v-slot:footer>
            <Footer />
        </template>
    </Layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { register } from '@redneckz/microfront-core';
import { MicroFrontInShadow } from '@redneckz/microfront-core-vue';

import Layout from './components/Layout.vue';
import Footer from './components/Footer.vue';

const bootstrapHeader = register(
    'reactHost', // remote module name according to Module Federation config
    () => import('reactHost/Header') //  remote module
);

const bootstrapAds = register(
    'reactHost', // remote module name according to Module Federation config
    () => import('reactHost/FeaturedPostsList') //  remote module
);

export default defineComponent({
    name: 'App',
    components: {
        MicroFrontInShadow,
        Layout,
        Footer
    },
    methods: {
        bootstrapHeader,
        bootstrapAds
    }
});
</script>
