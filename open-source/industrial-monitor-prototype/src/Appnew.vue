<template>
  <div class="app-container">
    <!-- 时间查询区 -->
    <TimeQuery />

    <!-- 设备时间轴 -->
    <DeviceTimeline
      @hover="onDeviceHover"
      @select="onDeviceSelect"
    />

    <!-- 视频关键帧 -->
    <VideoTimeline
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
</template>

<script setup>
import { ref } from 'vue'

import TimeQuery from './components/TimeQuery.vue'
import DeviceTimeline from './components/DeviceTimeline.vue'
import VideoTimeline from './components/VideoTimeline.vue'
import AIProbabilityChart from './components/AIProbabilityChart.vue'
import LaserThicknessChart from './components/LaserThicknessChart.vue'

const aiRef = ref(null)
const laserRef = ref(null)

const selectedTime = ref(null)

// ===== 联动核心 =====
const syncTime = (time) => {
  aiRef.value?.highlightByTime(time)
  laserRef.value?.highlightByTime(time)
}

const onDeviceHover = ({ time }) => {
  if (selectedTime.value) return
  syncTime(time)
}

const onVideoHover = (time) => {
  if (selectedTime.value) return
  syncTime(time)
}

const onDeviceSelect = ({ time }) => {
  selectedTime.value = time
  syncTime(time)
}

const onVideoSelect = (time) => {
  selectedTime.value = time
  syncTime(time)
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
