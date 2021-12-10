<template>
  <a-layout-header class="layout-header" style="background: #fff; padding: 0">
    <RemixIcon
      class="trigger"
      @click="toggleCollapse"
      :icon="collapsed ? 'menu-unfold-fill' : 'menu-fold-fill'"
    />
    <div class="user-info">
      <a-dropdown>
        <div>
          <span>admin</span>
          <a-avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
          />
        </div>

        <template #overlay>
          <a-menu>
            <a-menu-item> 个人信息 </a-menu-item>
            <a-menu-item> 退出 </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { appStore } from "@/store/app";
import { delHideMenu } from "@/utils/tools";
import RemixIcon from "@/components/RemixIcon.vue";

export default defineComponent({
  name: "Header",
  components: { RemixIcon },
  setup() {
    const store = appStore();
    return {
      collapsed: computed(() => store.collapsed),
      theme: computed(() => store.theme),
      routes: computed(() => delHideMenu(store.routes)),
      toggleCollapse: store.toggleCollapse,
    };
  },
});
</script>

<style lang="scss" scoped>
.layout-header {
  position: sticky;
  top: 0;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  z-index: 10;
  height: 64px;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

.user-info {
  cursor: pointer;
  margin-right: 20px;
}

.trigger {
  font-size: 18px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}
</style>
