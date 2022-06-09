<script setup lang="ts">
import { computed, ref } from 'vue';
import tags from './tags.json'
import RemixIcon from '../RemixIcon.vue'
const IconType = {
    Buildings: '建筑',
    Business: '商业',
    Communication: '交流',
    Design: '设计',
    Device: '设备',
    Development: '开发',
    Document: '文档',
    Editor: '编辑器',
    Finance: '金融',
    'Health & Medical': '健康',
    Logos: '标志',
    Map: '地图',
    Media: '媒体',
    System: '系统',
    "User&Faces": '用户',
    Weather: '商业',
    Others: '商业',
}
const emits = defineEmits(['onSelect'])
const tabs = Object.keys(tags)
const activeKey = ref(tabs[0])
const currentIcons = computed(() => {
    return Object.keys(tags[activeKey.value])
})

function getIconProp(icon: string, sub: string) {
    return activeKey.value === 'Editor' ? icon : `${icon}-${sub}`
}

</script>

<template>
    <div class="container">
        <a-tabs v-model:activeKey="activeKey" centered>
            <a-tab-pane v-for="tab in tabs" :key="tab" :tab="IconType[tab]">
                <a-row :gutter="[16, 8]">
                    <template v-for="icon in currentIcons">
                        <a-col @click="emits('onSelect', getIconProp(icon, 'line'))" :span="2">
                            <div class="icon_box">
                                <RemixIcon :icon="getIconProp(icon, 'line')" />
                            </div>
                        </a-col>
                        <a-col @click="emits('onSelect', getIconProp(icon, 'fill'))" :span="2">
                            <div class="icon_box">
                                <RemixIcon :icon="getIconProp(icon, 'fill')" />
                            </div>
                        </a-col>
                    </template>
                </a-row>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<style lang="scss" scoped>
.container{
    padding: 0 10px;
}
.icon_box {
    display: flex;
    align-items: center;
    justify-content: center;

    i {
        width: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 50%;
        padding: 15px;
        transition: all 0.3s;
    }
    i:hover {
        background: #eee;
    }
}
</style>