
<template>
    <a-sub-menu>
        <template v-slot:title>
            <span class="anticon"></span>
            <span>{{ props.item.title }}</span>
        </template>
        <slot></slot>
    </a-sub-menu>
</template>

<script setup lang="ts">
const props = defineProps({
    item: {
        type: Object,
        default: {}
    }
})
</script>

<style>
</style>
