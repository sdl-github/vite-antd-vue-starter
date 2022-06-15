
<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const menus = ref<Array<{ name: string, path: string }>>()

watchEffect(() => {
    menus.value = route.matched.map(item => {
        return {
            name: item.meta.title,
            path: item.path
        }
    })
});

</script>

<template>
    <a-breadcrumb>
        <a-breadcrumb-item v-for="menu in menus">{{ menu.name }}</a-breadcrumb-item>
    </a-breadcrumb>
</template>