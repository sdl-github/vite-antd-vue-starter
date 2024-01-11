<route lang="yaml">
    meta:
      layout: dashboard
</route>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import type { Point } from './point/data'
import { queryAllUserList } from '~/api/user'
import type { ModelTypes } from '~/utils/graphql/zeus'
import { createPoint } from '~/api/point'

const fengmap = window.fengmap
let markers: any[] = []
const userOptions = ref<ModelTypes['User'][]>([])
const saveLoading = ref(false)
const userId = ref()
const type = ref(1)
const trackData = ref<Point[]>([])
onMounted(() => {
  queryAllUserList().then((res) => {
    userOptions.value = res
  })
})

function loaded() {
  const map = window.map
  // 注册地图点击事件
  window.map.on('click', (event: any) => {
    if (!userId.value || !type.value) {
      message.info('请选择用户和类型')
      return
    }
    const { coords: { x, y, z }, level } = event
    if (x && y && z && level) {
      const point: Point = {
        x,
        y,
        z: 0.1,
        level,
        userId: userId.value,
        type: type.value,
      }
      trackData.value.push(point)
      // 添加点击mark
      const marker = new fengmap.FMImageMarker({
        url: 'https://developer.fengmap.com/fmAPI/images/red.png',
        x: event.coords.x,
        y: event.coords.y,
        anchor: fengmap.FMMarkerAnchor.BOTTOM,
      })
      const a = map.getFloor(event.level)
      marker.addTo(a)
      markers.push(marker)
    }
  })
}

function handleReset() {
  trackData.value = []
  markers.forEach((it) => {
    it.remove()
  })
  markers = []
}

async function handleSave() {
  if (!trackData.value.length) {
    message.info('请选择点位')
    return
  }
  const loading = message.loading('加载中', 0)
  try {
    saveLoading.value = true
    for (let i = 0; i < trackData.value.length; i++) {
      const point = trackData.value[i]
      await createPoint(point)
    }
    loading()
    saveLoading.value = false
    message.success('成功')
    handleReset()
  }
  catch (e) {
    loading()
    saveLoading.value = false
  }
}

onBeforeUnmount(() => {
  handleReset()
})
</script>

<template>
  <div class="relative h-full w-full">
    <div class="absolute left-40px top-20px z-99 rounded p-4" bg-white>
      <ASelect
        v-model:value="userId"
        class="w-200px"
        placeholder="请选择用户"
      >
        <ASelectOption v-for="user in userOptions" :key="user.id" :value="user.id">
          {{ user.nickName || user.userName }}
        </ASelectOption>
      </ASelect>
      <ASelect v-model:value="type" class="ml-2 w-200px" placeholder="请选择类型">
        <ASelectOption :value="1">
          轨迹回放
        </ASelectOption>
        <ASelectOption :value="2">
          实时数据定位点
        </ASelectOption>
      </ASelect>
      <AButton :loading="saveLoading" type="primary" style="margin-left: 10px" @click="handleSave">
        保存
      </AButton>
      <AButton style="margin-left: 10px" @click="handleReset">
        重置
      </AButton>
    </div>
    <FengMap @loaded="loaded" />
  </div>
</template>
