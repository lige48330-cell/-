<template>
  <div class="app-container">
    <!-- 时间查询区 -->
    <TimeQuery @query="handleQuery"/>

    <!-- 设备时间轴 -->
    <DeviceTimeline
    :queryParams="queryParams"
      @hover="onDeviceHover"
      @select="onDeviceSelect"
    />

    <!-- 视频关键帧 -->
    <VideoTimeline
      :queryParams="queryParams"
      @hover="onVideoHover"
      @select="onVideoSelect"
    />
    <!-- 图表区域 -->
    <div class="charts">
      <div class="chart-wrapper">
        <AIProbabilityChart ref="aiRef" />
      </div>

      <div class="chart-wrapper">
        <LaserThicknessChart ref="laserRef" />
      </div>
    </div>
  </div>
<div class="app">
    <TimeQuery @query="handleQuery" />

    <DeviceTimeline :queryParams="queryParams" />
    <VideoTimeline :queryParams="queryParams" />
    <AIProbabilityChart :queryParams="queryParams" />
    <LaserThicknessChart :queryParams="queryParams" />
  </div>
</template>
<script setup>
import { ref } from 'vue'

import TimeQuery from './components/TimeQuery.vue'
import DeviceTimeline from './components/DeviceTimeline.vue'
import VideoTimeline from './components/VideoTimeline.vue'
import AIProbabilityChart from './components/AIProbabilityChart.vue'
import LaserThicknessChart from './components/LaserThicknessChart.vue'

const queryParams = ref({
  dateType: '',
  startTime: '',
  endTime: ''
})
const hoverTime = ref(null)
const hoverDevice = ref(null)
const selectedDevice = ref(null)

/* 查询 */
function handleQuery(params) {
  queryParams.value = params
}

/* 设备 hover */
function onDeviceHover(payload) {
  if (!payload) {
    hoverTime.value = null
    hoverDevice.value = null
    return
  }
  hoverTime.value = payload.time
  hoverDevice.value = payload.deviceId
}

/* ✅ 设备 click（必须定义，否则 warn） */
function onDeviceSelect(payload) {
  selectedDevice.value = payload
  console.log('设备选中:', payload)
}

/* ✅ 视频 hover */
function onVideoHover(payload) {
  if (!payload) {
    hoverTime.value = null
    return
  }
  hoverTime.value = payload.time
}

/* ✅ 视频 click */
function onVideoSelect(payload) {
  console.log('视频帧选中:', payload)
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: rgb(152, 245, 249);
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 图表区域 */
.charts {
  flex: 1;
  display: flex;
  gap: 12px;
}

/* 每个图表一个固定高度容器 */
.chart-wrapper {
  flex: 1;
  height: 360px;
}

.pagination {
  display: flex;
  justify-content: center;
}
</style>
