<template>
    <component :is="isMenuType() ? Menu : Sub" :item="item">
        <template v-if="item?.children && item.children.length">
            <SideMenu v-for="route in item.children" :key="route.path" :item="route"></SideMenu>
        </template>
    </component>
</template>

<script lang="ts">
import Menu from './MenuItem.vue'
import Sub from './SubMenuItem.vue'
import {defineComponent} from "vue"
import {RouteRecordRaw} from "vue-router";

export default defineComponent({
    name: 'SideMenu',
    props: {
        item: {
            type: Object,
            default: {}
        }
    },
    setup(props) {
        const {item}: any = props
        const isMenuType = () => {
            const child = handleChildren(item.children)
            if (child?.length === 0) {
                return true
            } else {
                return false
            }
        }
        const handleChildren = (children?: RouteRecordRaw[]) => {
            if (!children) {
                return []
            }
            return children.filter((item: any) => item.hidden !== true)
        }
        return {
            isMenuType,
            item,
            Menu,
            Sub
        }
    }
})

</script>

<style lang="scss">
.anticon {
    margin-right: 3px !important;
}

.anticon + span {

}
</style>
