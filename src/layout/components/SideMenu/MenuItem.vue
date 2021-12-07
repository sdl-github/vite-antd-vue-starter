
<template>
    <a-menu-item :key="menu.path" @click="handleLink">
        <span class="anticon"></span>
        <span>{{ menu.title }}</span>
    </a-menu-item>
</template>

<script lang="ts">
import router from '@/router';
import { defineComponent, defineProps } from 'vue';

export default defineComponent({
    props: {
        item: {
            type: Object,
            default: {}
        }
    },
    setup(props) {
        const handleLink = () => {
            const path = props.item.path
            router.push(path)
        }
        return {
            menu: props.item,
            handleLink
        }
    }
})


</script>

<style>
</style>
