<route lang="yaml">
  meta:
    layout: dashboard
</route>

<script setup lang="tsx">
let fengmap = window.fengmap as any
let map: any;
onMounted(() => {

  const options = {
    container: document.getElementById('fengmap'),
    appName: 'APP',
    key: '788ab5301605c28fe0e031b689295f6e',
    mapID: '1744325781608030210',
    themeID: '1581910231660457986',
    level: 2,
    mapZoom: 19.5,
  }
  map = new fengmap.FMMap(options);
  
  map.on('loaded', function () {
    console.log('loaded');
    const textMarker = new fengmap.FMTextMarker({
      text: '采空区',
      x: 12613436.921387225,
      y: 2642627.4136026776
    });

    var floor = map.getFloor(1);
    textMarker.addTo(floor);


    // 指北针控件
    const scrollCompassCtlOpt = {
      position: fengmap.FMControlPosition.RIGHT_TOP,
      offset: {
        x: -20,
        y: 80
      },

    };
    const compass = new fengmap.FMCompass(scrollCompassCtlOpt);
    compass.addTo(map);

    compass.on('click', function () {
      map.setRotation({
        rotation: 0,
        animate: true,
        duration: 0.3,
        finish: function () { console.log('setRotation'); }
      })
    });

    // 缩放控件
    const scrollZoomCtlOpt = {
      position: fengmap.FMControlPosition.RIGHT_TOP,
      offset: {
        x: -20,
        y: 510
      },

    };
    const toolbar = new fengmap.FMZoomBar(scrollZoomCtlOpt);
    toolbar.addTo(map)

    // 楼层控件
    let scrollFloorCtlOpt = {
      position: fengmap.FMControlPosition.RIGHT_TOP,
      floorButtonCount: 5,
      offset: {
        x: -20,
        y: 150
      },
      viewModeControl: true,
      floorModeControl: true,
      needAllLayerBtn: true
    };

    let scrollFloorControl = new fengmap.FMToolbar(scrollFloorCtlOpt);
    scrollFloorControl.addTo(map)

    // 比例尺控件
    const scrollScaleBarCtlOpt = {
      fontSize: 18,
      height: 30,
      position: fengmap.FMControlPosition.LEFT_BOTTOM,
      offset: {
        x: 20,
        y: -20
      },

    };
    const scaleBar = new fengmap.FMScaleBar(scrollScaleBarCtlOpt);
    scaleBar.addTo(map)
  });
})
</script>

<template>
  <div class="w-full h-80vh">
    <div class="fengmap" id="fengmap">map</div>
  </div>
</template>

<style lang="scss"></style>
