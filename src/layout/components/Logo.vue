<template>
    <div class="logo">
        <img :src="logo||defaultLogo" class="sidebar-logo"/>
        <h1 class="sidebar-title">{{ name }}</h1>
    </div>
</template>
<script lang="ts">
import {appStore} from "@/store/app";
import {computed, defineComponent} from "vue";

export default defineComponent({
    name: "Logo",
    setup() {
        const store = appStore();
        const defaultLogo = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiI+CiAgICA8ZGVmcz4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSI1MCUiIHgyPSI1MCUiIHkxPSIwJSIgeTI9IjEwMCUiPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDhCMUZBIi8+CiAgICAgICAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzRGOEVGRiIvPgogICAgICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJjIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzAwOTBGRiIvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDU5RkYiLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgICAgIDxwYXRoIGlkPSJiIiBkPSJNMCAwbDI2IDI2SDB6Ii8+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJkIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj4KICAgICAgICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGM0E1MCIvPgogICAgICAgICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNFRDMwNkIiLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPC9kZWZzPgogICAgPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8cGF0aCBkPSJNMCAwaDMydjMySDB6Ii8+CiAgICAgICAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMyA0KSI+CiAgICAgICAgICAgIDxwYXRoIGZpbGw9InVybCgjYSkiIGQ9Ik0xNi4zMzIuMDA1QTcuNjYyIDcuNjYyIDAgMCAwIDE2IDIuMjZDMTYgNS44NjYgMTkuMTM0IDkgMjMuMjYgOWE2LjQ3NiA2LjQ3NiAwIDAgMCAyLjk5OS0uNzVjLjE1OC43MjUuMjQxIDEuNDc4LjI0MSAyLjI1QzI2LjUgMTYuMjk5IDIxLjc5OSAyMSAxNiAyMXY1SDBWMGgxNmMuMTExIDAgLjIyMi4wMDIuMzMyLjAwNXoiLz4KICAgICAgICAgICAgPHVzZSBmaWxsPSJ1cmwoI2MpIiB4bGluazpocmVmPSIjYiIvPgogICAgICAgIDwvZz4KICAgICAgICA8Y2lyY2xlIGN4PSIyNiIgY3k9IjYiIHI9IjQiIGZpbGw9InVybCgjZCkiLz4KICAgIDwvZz4KPC9zdmc+Cg=='
        return {
            name: computed(() => store.title),
            logo: computed(() => store.logo),
            collapsed: computed(() => store.collapsed),
            theme: computed(() => store.theme),
            defaultLogo
        };
    }
});
</script>

<style lang="scss" scoped>
.logo {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    overflow: hidden;

    .sidebar-logo {
        width: 32px;
        height: 32px;
        vertical-align: middle;
    }

    .sidebar-title {
        margin-left: 12px;
        display: inline-block;
        color: #fff;
        font-weight: 500;
        line-height: 50px;
        font-size: 16px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        vertical-align: middle;
    }
}
</style>
