<template>
    <span class="footer">
        Copyright ©
        <a href="https://micro-frontends.org/">Micro Frontends</a>
        {{ new Date().getFullYear() }}.
    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'Footer'
});
</script>

<style scoped>
.footer {
    color: rgba(0, 0, 0, 0.54);
    font-size: 0.875rem;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-weight: 400;
    line-height: 1.43;
}
a {
    color: inherit;
}
</style>
