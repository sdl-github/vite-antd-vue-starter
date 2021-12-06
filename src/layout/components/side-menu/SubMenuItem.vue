
<template>
    <a-sub-menu>
        <template v-slot:title>
            <span class="anticon"></span>
            <span>{{ menu.title }}</span>
        </template>
        <slot></slot>
    </a-sub-menu>
</template>

<script lang="ts">
import { defineComponent, defineProps } from 'vue';

export default defineComponent({
    props: {
        item: {
            type: Object,
            default: {}
        },
    },
    setup(props) {
        return {
            menu: props.item,
        }
    }
})
</script>

<style>
</style>
