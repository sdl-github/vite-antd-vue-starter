<template>
    <a-menu-item class="menu-item" :key="menu.path" @click="handleLink">
        <span class="anticon">
            <RemixIcon :icon="item?.meta?.icon"/>
        </span>
        <span>{{ menu?.meta?.title }}</span>
    </a-menu-item>
</template>

<script lang="ts">
import router from '@/router';
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
        }
    },
    setup(props) {
        const handleLink = () => {
            const path = props.item.path            
            router.push(path)
        }
        return {
            RemixIcon,
            menu: props.item,
            handleLink
        }
    }
})


</script>

<style scoped lang='scss'>

</style>
