<script setup lang="tsx">
const emits = defineEmits(['loaded'])
const fengmap = window.fengmap
let map: any

onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  map = null
  window.map = null
  window.floorInfo = null
})
// 初始化地图
function initMap() {
  const options = {
    container: document.getElementById('fengmap'),
    appName: 'APP',
    key: '788ab5301605c28fe0e031b689295f6e',
    mapID: '1744325781608030210',
    themeID: '1581910231660457986',
    level: 2,
    mapZoom: 20.6,
    visibleLevels: [1, 2],
  }
  map = new fengmap.FMMap(options)
  // 地图加载完成事件
  map.on('loaded', () => {
    window.map = map
    emits('loaded')
    // 获取地图楼层信息
    window.floorInfo = map.getFloorInfos()
    const textMarker = new fengmap.FMTextMarker({
      text: '采空区',
      x: 12613436.921387225,
      y: 2642627.4136026776,
    })

    const floor = map.getFloor(1)
    textMarker.addTo(floor)

    // 缩放控件
    const scrollZoomCtlOpt = {
      position: fengmap.FMControlPosition.RIGHT_TOP,
      offset: {
        x: -20,
        y: 510,
      },
    }

    const toolbar = new fengmap.FMZoomBar(scrollZoomCtlOpt)
    toolbar.addTo(map)

    // 楼层控件
    const scrollFloorCtlOpt = {
      position: fengmap.FMControlPosition.RIGHT_TOP,
      floorButtonCount: 5,
      offset: {
        x: -20,
        y: 150,
      },
      viewModeControl: true,
      floorModeControl: true,
      needAllLayerBtn: true,
    }

    const scrollFloorControl = new fengmap.FMToolbar(scrollFloorCtlOpt)
    scrollFloorControl.addTo(map)

    // 比例尺控件
    const scrollScaleBarCtlOpt = {
      fontSize: 18,
      height: 30,
      position: fengmap.FMControlPosition.LEFT_BOTTOM,
      offset: {
        x: 20,
        y: -20,
      },
    }
    const scaleBar = new fengmap.FMScaleBar(scrollScaleBarCtlOpt)
    scaleBar.addTo(map)
  })
}
</script>

<template>
  <div class="h-91vh w-90vw">
    <div id="fengmap" class="fengmap" />
  </div>
</template>

  <style lang="scss"></style>
