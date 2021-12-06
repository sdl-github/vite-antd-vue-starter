
<template>
    <component :is="isMenuType() ? Menu : Sub" :item="item">
        <template v-if="props?.item?.children && props.item.children.length">
            <Side v-for="route in props.item.children" :key="route.path" :item="route"></Side>
        </template>
    </component>
</template>

<script setup lang="ts">
import { appStore } from "@/store/app";
import { computed, ref } from "vue"
// @ts-ignore
import Menu from './MenuItem.vue'
// @ts-ignore
import Sub from './SubMenuItem.vue'
//@ts-ignore
import Side from '@/layout/components/side-menu/index.vue'
import { DashboardOutlined, FileImageOutlined } from '@ant-design/icons-vue';
import { IMenuItem } from "@/router";

enum MenuType {
    MenuItem = 'Menu',
    SubMenuItem = 'Sub',
}

const menuComponent = ref('')
const props = defineProps({
    item: Object
})

const isMenuType = () => {
    const { item } = props
    const child = handleChildren(item?.children)
    if (child?.length === 0) {
        return true
    } else {
        return false
    }

}
const handleChildren = (children?: IMenuItem[]) => {
    if (!children) {
        return []
    }
    return children.filter((item: any) => item.hidden !== true)
}

</script>

<style lang="scss">
.anticon {
    margin-right: 3px !important;
}
</style>
