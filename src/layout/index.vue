<template>
    <a-layout class="layout">
        <a-layout-sider
            class="layout-sider"
            v-model:collapsed="collapsed"
            :trigger="null"
            :theme="theme"
            collapsible
        >
            <Logo/>
            <a-menu :theme="theme" mode="inline">
                <SideMenu v-for="route in routes" :key="route.path" :item="route"/>
            </a-menu>
        </a-layout-sider>

        <a-layout class="main-layout">
            <Header/>
            <Main/>
        </a-layout>
    </a-layout>
</template>
<script lang="ts">
import SideMenu from "@/layout/components/SideMenu/index.vue";
import Logo from "@/layout/components/Logo.vue";
import Main from "@/layout/components/Main.vue";
import Header from "@/layout/components/Header.vue";
import {appStore} from "@/store/app";
import {computed, defineComponent} from "vue";
import {delHideMenu} from "@/utils/tools";

export default defineComponent({
    components: {
        Header,
        SideMenu,
        Logo,
        Main,
    },
    setup() {
        const store = appStore();
        const toggleCollapse = store.toggleCollapse;
        const routes = computed(() => delHideMenu(store.routes));
        return {
            collapsed: computed(() => store.collapsed),
            theme: computed(() => store.theme),
            toggleCollapse,
            routes
        };
    },
});
</script>

<style scoped lang="scss">

.layout {
    //font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
    .layout-sider {
       //height: 100%;
    }
    .main-layout {
        min-height: 100vh;
        //padding-left: 250px;
        //transition: all 0.2s;
    }
}

</style>
