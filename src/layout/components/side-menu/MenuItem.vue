
<template>
    <a-menu-item :key="props.item.path" @click="handleLink">
        <span class="anticon"></span>
        <span>{{ props.item.title }}</span>
    </a-menu-item>
</template>

<script setup lang="ts">
import router, { IMenuItem } from '@/router';


interface Props {
    msg?: string
    labels?: string[]
}

const props = defineProps({
    item: {
        type: Object,
        default: {}
    }
})
const handleLink = () => {
    const path = props.item.path
    router.push(path)
}
</script>

<style>
</style>
