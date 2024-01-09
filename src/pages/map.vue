<route lang="yaml">
    meta:
      layout: dashboard
</route>

<script setup lang="ts">
interface Point {
  x: number
  y: number
  z: number
  level: number
  time: number
}

const trackData: Point[] = []
const fengmap = window.fengmap
let tracksPlayer = null // 轨迹回放类
const speed = 1 // 默认速度，播放速度： speedMultiple * speed
const speedMultiple = 1 // 倍速
let sliderIns // 滑块实例
// const startValue = new Date(trackData[0].time).valueOf();                 // 滑块开始值
// const endValue = new Date(trackData[trackData.length - 1].time).valueOf();// 滑块结束值
const isPause = false // 是否在暂停状态
const isComplete = false // 是否播放完成，播放完成后需要先调用start方法，再执行play
const coordMarkers = [] // 起终点图标
onMounted(() => {
})

function loaded() {
  const map = window.map
  let marker: any
  // 注册地图点击事件
  window.map.on('click', (event: any) => {
    const floorInfo = window.floorInfo
    marker && marker.remove()
    marker = null
    const clickMode = event.targets.find((it: any) => it.type === fengmap.FMType.MODEL)
    const floor = floorInfo.find((it: any) => it.level === event.level)
    const { coords: { x, y, z }, level } = event
    if (x && y && z && level)
      trackData.push({ x, y, z: 0.1, level, time: new Date().valueOf() })

    // // 更新界面的点击信息
    // UI.updateInfo(clickMode, floor, event)
    console.log(clickMode, floor, event)
    // 添加点击mark
    marker = new fengmap.FMImageMarker({
      url: 'https://developer.fengmap.com/fmAPI/images/red.png',
      x: event.coords.x,
      y: event.coords.y,
      anchor: fengmap.FMMarkerAnchor.BOTTOM,
    })
    const a = map.getFloor(event.level)
    marker.addTo(a)
  })
}

function playTrackData() {
  tracksPlayer.play()
}
function initTrackData() {
  const map = window.map
  const fengmap = window.fengmap

  console.log(trackData)

  // 自行添加起终点marker
  addStartAndEndMarker()
  // 初始化轨迹播放插件
  tracksPlayer = new fengmap.FMTracksPlayer(window.map)
  // 设置路径轨迹数据
  tracksPlayer.setTracks(trackData)
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
      x: trackData[0].x,
      y: trackData[0].y,
      level: trackData[0].level,
      size: 24,
    },
  }
  // 设置定位点图标
  tracksPlayer.setMarkerStyle(locationMarker.type, locationMarker.options)
  // 将轨迹线和定位点渲染到地图上
  tracksPlayer.render()
  // 设置轨迹回放速度
  tracksPlayer.setSpeed(speed)
  // 播放中的回调函数
  tracksPlayer.on('playing', (params) => {
    const progress = params.progress // 当前播放进度时间戳
    const level = params.level // 所在楼层
    console.log('playing', progress)
    // // 设置进度条
    // const curValue = progress - startValue
    // sliderIns.setValue(curValue)
  })
  // 轨迹播放完成回调函数
  tracksPlayer.on('complete', () => {
    console.log('轨迹播放完成')
    // isComplete = true;
    // // 更改播放按钮状态
    // var dom = document.getElementById('playBtn');
    // dom.classList.remove('icon-zanting');
    // dom.classList.add('icon-yunhang');
    // isPause = false;
  })
}
// 自行添加起终点marker
function addStartAndEndMarker() {
  const map = window.map
  const coords = [
    { x: trackData[0].x, y: trackData[0].y, level: trackData[0].level, url: 'https://developer.fengmap.com/fmAPI/images/start.png' },
    { x: trackData[trackData.length - 1].x, y: trackData[trackData.length - 1].y, level: trackData[trackData.length - 1].level, url: 'https://developer.fengmap.com/fmAPI/images/end.png' },
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
</script>

<template>
  <div class="h-full w-full">
    <div class="relative z-99">
      <AButton @click="initTrackData">
        模拟轨迹回放保存数据
      </AButton>
      <AButton @click="playTrackData">
        模拟轨迹回放播放
      </AButton>
    </div>
    <FengMap @loaded="loaded" />
  </div>
</template>

  <style lang="scss"></style>
