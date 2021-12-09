<template>
    <a-sub-menu :key="item.path">
        <template v-slot:title>
            <span class="anticon">
              <RemixIcon :icon="item?.meta?.icon"/>
            </span>
            <span>{{ item?.meta?.title }}</span>
        </template>
        <slot></slot>
    </a-sub-menu>
</template>

<script lang="ts">
import RemixIcon from '@/components/RemixIcon.vue'
import {defineComponent} from 'vue';

export default defineComponent({
    components: {
        RemixIcon
    },
    props: {
        item: {
            type: Object,
            default: {}
        },
    },
    setup(props) {
        return {
            RemixIcon
        }
    }
})
</script>

<style>
</style>
