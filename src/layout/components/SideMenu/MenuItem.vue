<template>
    <a-menu-item class="menu-item" :key="menu.path" @click="handleLink">
        <span class="anticon">
            <github-outlined/>
        </span>
        <span>{{ menu.title }}</span>
    </a-menu-item>
</template>

<script lang="ts">
import router from '@/router';
import {defineComponent, defineProps} from 'vue';
import {GithubOutlined} from '@ant-design/icons-vue';

export default defineComponent({
    components: {
        GithubOutlined
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
            GithubOutlined,
            menu: props.item,
            handleLink
        }
    }
})


</script>

<style scoped lang='scss'>

</style>
