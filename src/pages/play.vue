<route lang="yaml">
    meta:
      layout: dashboard
</route>

<script setup lang="ts">
import { message } from 'ant-design-vue'
import type { Point, SearchParam } from './point/data'
import { queryPointPage } from '~/api/point'
import { queryAllUserList } from '~/api/user'
import type { GenderEnum, MenuTypeEnum, ModelTypes } from '~/utils/graphql/zeus'

const fengmap = window.fengmap
const trackData = ref<Point[]>([])
let coordMarkers: any[] = []
let tracksPlayer: any = null // 轨迹回放类
const speed = 0.5 // 默认速度

const loading = ref(true)
const search = reactive<SearchParam>({
  pageNo: DEFAULT_PAGE_NO,
  pageSize: 999,
  type: 1,
  createdAtFrom: '',
  createdAtTo: '',
  nickName: '',
  userId: undefined,
})
const userOptions = ref<ModelTypes['User'][]>([])

onMounted(() => {
  queryAllUserList().then((res: { avatar?: string | undefined; createdAt?: any; createdBy?: string | undefined; email?: string | undefined; gender?: GenderEnum | undefined; id?: string | undefined; nickName?: string | undefined; phone?: string | undefined; roles?: ({ createdAt?: any; createdBy?: string | undefined; default?: number | undefined; id?: string | undefined; key?: string | undefined; level?: number | undefined; menus?: ({ children?: (any | undefined)[] | undefined; component?: string | undefined; createdAt?: any; createdBy?: string | undefined; frame?: boolean | undefined; icon?: string | undefined; id?: string | undefined; name?: string | undefined; parent?: any | undefined; parentId?: string | undefined; path?: string | undefined; permission?: string | undefined; roles?: (any | undefined)[] | undefined; sort?: number | undefined; title?: string | undefined; type?: MenuTypeEnum | undefined; updatedAt?: any; updatedBy?: string | undefined; visible?: boolean | undefined } | undefined)[] | undefined; name?: string | undefined; updatedAt?: any; updatedBy?: string | undefined; users?: (any | undefined)[] | undefined } | undefined)[] | undefined; updatedAt?: any; updatedBy?: string | undefined; userName?: string | undefined }[]) => {
    userOptions.value = res
  })
})

onBeforeUnmount(() => {
  resetMarker()
})

function handleReset() {
  resetMarker()
  trackData.value = []
}

function handlePlay() {
  tracksPlayer.start()
  tracksPlayer.play()
}

async function handleSearch() {
  if (!search.userId) {
    message.info('请选择用户')
    return
  }
  loading.value = true
  const { content } = await queryPointPage(search)
  trackData.value = content
  loading.value = false
  if (!content.length) {
    message.info('暂无轨迹数据')
    return
  }
  initTrackData()
}

function resetMarker() {
  coordMarkers.forEach((marker) => {
    marker.remove()
  })
  coordMarkers = []
  if (tracksPlayer) {
    tracksPlayer.clear()
    tracksPlayer.dispose()
    tracksPlayer = null
  }
}

function initTrackData() {
  resetMarker()
  // 自行添加起终点marker
  addStartAndEndMarker()
  // 初始化轨迹播放插件
  tracksPlayer = new fengmap.FMTracksPlayer(window.map)
  // 设置路径轨迹数据
  tracksPlayer.setTracks(trackData.value)
  // 设置线的样式
  tracksPlayer.setTrackStyle({
    width: 6,
    radius: 1,
    type: fengmap.FMLineType.ARROW,
    animate: true,
    height: 0,
  })
  // 设置定位点图标1 - LOCATION_MARKER
  const locationMarker = {
    type: fengmap.FMType.LOCATION_MARKER,
    options: {
      url: 'https://developer.fengmap.com/fmAPI/images/bluedot.png',
      height: 0.2,
      x: trackData.value[0].x,
      y: trackData.value[0].y,
      level: trackData.value[0].level,
      size: 24,
    },
  }
  // 设置定位点图标
  tracksPlayer.setMarkerStyle(locationMarker.type, locationMarker.options)
  // 将轨迹线和定位点渲染到地图上
  tracksPlayer.render()
  // 设置轨迹回放速度
  tracksPlayer.setSpeed(speed)
  // 轨迹播放完成回调函数
  tracksPlayer.on('complete', () => {
    message.success('轨迹播放完成')
  })
}
// 自行添加起终点marker
function addStartAndEndMarker() {
  const map = window.map
  const coords = [
    { x: trackData.value[0].x, y: trackData.value[0].y, level: trackData.value[0].level, url: 'https://developer.fengmap.com/fmAPI/images/start.png' },
    { x: trackData.value[trackData.value.length - 1].x, y: trackData.value[trackData.value.length - 1].y, level: trackData.value[trackData.value.length - 1].level, url: 'https://developer.fengmap.com/fmAPI/images/end.png' },
  ]
  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i]
    const im = new fengmap.FMImageMarker({
      x: coord.x,
      y: coord.y,
      url: coord.url,
      size: 32,
      height: 0.2,
      anchor: fengmap.FMMarkerAnchor.BOTTOM,
      depth: false,
      collision: true,
    })
    const floor = map.getFloor(coord.level)
    im.addTo(floor)
    coordMarkers.push(im)
  };
}
function loaded() {
  loading.value = false
}
</script>

<template>
  <div class="relative h-full w-full">
    <ASpin :spinning="loading" tip="加载中...">
      <div class="absolute left-0 right-0 top-0 z-99 rounded">
        <div class="mx-6 mt-4 rounded bg-white p-4">
          <ASelect
            v-model:value="search.userId"
            class="w-200px"
            placeholder="请选择用户"
          >
            <ASelectOption v-for="user in userOptions" :key="user.id" :value="user.id">
              {{ user.nickName || user.userName }}
            </ASelectOption>
          </ASelect>
          <ADatePicker
            v-model:value="search.createdAtFrom" placeholder="开始时间" :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" class="ml-2"
          />
          <ADatePicker
            v-model:value="search.createdAtTo" placeholder="结束时间" :show-time="{ format: 'HH:mm' }"
            format="YYYY-MM-DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" class="ml-2"
          />
          <AButton :loading="loading" type="primary" class="ml-2" @click="handleSearch">
            搜索
          </AButton>
          <AButton type="primary" class="ml-2" @click="handleReset">
            重置
          </AButton>

          <AButton v-if="trackData.length" type="primary" class="ml-2" @click="handlePlay">
            播放
          </AButton>
        </div>
      </div>
      <FengMap @loaded="loaded" />
    </ASpin>
  </div>
</template>
