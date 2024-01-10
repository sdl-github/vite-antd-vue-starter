<route lang="yaml">
  meta:
    layout: dashboard
</route>

<script setup lang="tsx">
import { useTippy } from 'vue-tippy'
import { Image } from 'ant-design-vue'
import type { Point } from './point/data'
import { queryPointPage } from '~/api/point'

const fengmap = window.fengmap
let markers: any[] = []
const list = ref<Point[]>([])
const point = ref<Point>({})

const { setProps, show, destroy } = useTippy(() => document.body, {
  placement: 'right-start',
  trigger: 'manual',
  interactive: true,
  arrow: false,
  zIndex: 2,
  offset: [0, 0],
  content: computed(() => {
    if (!point)
      return false

    return (
      <div key={point.value.id}>
        <div>
          <div class="flex">
            <div>用户名:</div>
            <div class="ml-2">{point.value.user?.userName}</div>
          </div>
          <div class="flex">
            <div>姓名:</div>
            <div class="ml-2">{point.value.user?.nickName}</div>
          </div>
          <div class="flex">
            <div>手机号码:</div>
            <div class="ml-2">{point.value.user?.phone || '-'}</div>
          </div>
          <div class="flex">
            <div>x:</div>
            <div class="ml-2">{point.value.x || '-'}</div>
          </div>
          <div class="flex">
            <div>y:</div>
            <div class="ml-2">{point.value.y || '-'}</div>
          </div>
          <div class="flex">
            <div>z:</div>
            <div class="ml-2">{point.value.z && (point.value.z - 600) || '-'}</div>
          </div>
          <div class="flex">
            <div>呼救信息:</div>
            <div class="ml-2">一切正常</div>
          </div>
          <div class="flex">
            <div>监控时间:</div>
            <div class="ml-2">{formatDate(point.value.createdAt)}</div>
          </div>
        </div>
        {point.value.file?.url && (
          <div>
            <div>媒体信息</div>
            {point.value.file?.mimeType === 'image/jpeg' && (
              <Image
                width="200"
                height={150}
                class="object-cover"
                src={point.value.file.url}
              />
            )}
            {point.value.file?.mimeType === 'video/mp4' && (
              <video src={point.value.file?.url} controls width="200"></video>
            )}
          </div>
        )}
      </div>
    )
  }),
  onClickOutside: () => {
    destroy()
  },
})

onMounted(() => {

})

onBeforeUnmount(() => {
  markers.forEach((it) => {
    it.remove()
  })
  markers = []
})

function loaded() {
  queryPointPage({ pageNo: 1, pageSize: 999, type: 2 }).then((res) => {
    list.value = res.content
    res.content.forEach((point) => {
      const marker = addLocationMarker(point)
      markers.push(marker)
    })
    setTimeout(() => {
      nextTick(() => {
        const doms = document.querySelectorAll('.dom-point')
        doms.forEach((dom) => {
          dom.addEventListener('click', (event) => {
            const id = dom.id
            const p = list.value.find(it => it.id === id)
            if (!p)
              return
            point.value = p
            setProps({
              getReferenceClientRect: () => ({
                width: 0,
                height: 0,
                top: event.clientY,
                bottom: event.clientY,
                left: event.clientX,
                right: event.clientX,
              }),
            })
            show()
          })
        })
      })
    }, 1000)
  })
}

// 添加定位点标注
function addLocationMarker(ops: Point) {
  const map = window.map
  const locationMarker = new fengmap.FMDomMarker({
    height: 0.1,
    size: 20,
    level: ops.level,
    url: ops.user?.avatar || 'https://developer.fengmap.com/fmAPI/images/location.png',
    x: ops.x,
    y: ops.y,
    anchor: 'CENTER',
    collision: false,
    content: `<div id=${ops.id} class='dom-point'></div>`,
    ...ops,
  })
  const floor = map.getFloor(ops.level)
  locationMarker.addTo(floor)
  return locationMarker
}
</script>

<template>
  <div class="relative h-full w-full">
    <div class="absolute left-0 right-0 top-0 z-99 rounded">
      <div class="mx-6 mt-4 rounded bg-white p-4">
        some
      </div>
    </div>
    <FengMap @loaded="loaded" />
  </div>
</template>

<style lang="scss"></style>
