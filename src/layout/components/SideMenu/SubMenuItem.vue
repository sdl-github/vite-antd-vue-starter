<template>
    <a-sub-menu>
        <template v-slot:title>
            <span class="anticon">
                <github-outlined/>
            </span>
            <span>{{ menu.title }}</span>
        </template>
        <slot></slot>
    </a-sub-menu>
</template>

<script lang="ts">
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
        },
    },
    setup(props) {
        return {
            GithubOutlined,
            menu: props.item,
        }
    }
})
</script>

<style>
</style>
