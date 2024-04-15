<route lang="yaml">
    meta:
      layout: dashboard
</route>

<script>

import * as echarts from "echarts";

export default {
  name: 'EChartsComponent',
  mounted() {
    console.log("int1")
    var myChart = echarts.init(this.$refs.echartsContainer);
    console.log("int2")
    request({
        url: '/user/statics',
         method: 'get',
    }).then(res=>{
      console.log(res.x)
      myChart.setOption({
      // ECharts 配置项
      title: {
        text: '社区居民数据统计'
      },
      tooltip: {},
      xAxis: {
        data: res.x
      },
      yAxis: {},
      series: [{
        name: '人数',
        type: 'line',
        data: res.y
      }]
    });
    });
  
  }
}
</script>

<template>
    <div ref="echartsContainer" style="width: 1200px; height: 800px;left: 50px;top:50px"></div>
  </template>
  
