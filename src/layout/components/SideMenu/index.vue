<template>
  <component :is="isMenuType ? Menu : Sub" :item="menuItem">
    <template v-if="item?.children && item.children.length">
      <SideMenu
        v-for="route in item.children"
        :key="route.path"
        :item="route"
      ></SideMenu>
    </template>
  </component>
</template>

<script lang="ts">
import Menu from "./MenuItem.vue";
import Sub from "./SubMenuItem.vue";
import { defineComponent, reactive, ref } from "vue";
import { RouteRecordRaw } from "vue-router";

export default defineComponent({
  name: "SideMenu",
  props: {
    item: {
      type: Object,
      default: {},
    },
  },
  setup(props) {
    let menuItem = reactive({});
    const { item }: any = props;
    let isMenuType = ref(true);
    const init = () => {
      const child = handleChildren(item.children);
      if (child?.length === 0) {
        menuItem = item;
      } else if (child?.length === 1) {
        menuItem = item;
      } else {
        menuItem = item;
        isMenuType.value = false;
      }
    };
    const handleChildren = (children?: RouteRecordRaw[]) => {
      if (!children) {
        return [];
      }
      return children.filter((item: any) => item.hidden !== true);
    };
    init();
    return {
      isMenuType,
      menuItem,
      Menu,
      Sub,
    };
  },
});
</script>

<style lang="scss">
.anticon {
  margin-right: 3px !important;
}
</style>
