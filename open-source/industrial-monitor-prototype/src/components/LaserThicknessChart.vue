<template>
  <el-card class="card">
    <div class="title">激光厚度分析
      <span class="unit">单位：mm</span>
      </div>
    <div class="header">
    </div>
    <div ref="chartRef" class="chart" />
  </el-card>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, defineExpose } from 'vue'
import * as echarts from 'echarts'

/**
 * mock 时间 & 数据
 * 与 AI 概率 / 视频帧保持统一时间粒度（5 分钟）
 */
const timeList = [
  '08:00','08:05','08:10','08:15','08:20','08:25',
  '08:30','08:35','08:40','08:45','08:50','08:55','09:00'
]

// mock 三条激光厚度
const thicknessA = timeList.map(() => +(2.5 + Math.random() * 0.3).toFixed(2))
const thicknessB = timeList.map(() => +(2.7 + Math.random() * 0.3).toFixed(2))
const thicknessC = timeList.map(() => +(2.6 + Math.random() * 0.3).toFixed(2))

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  chartInstance = echarts.init(chartRef.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      }
    },
    legend: {
      top: 8,
      data: ['厚度 A', '厚度 B', '厚度 C']
    },
    grid: {
      left: 40,
      right: 20,
      top: 50,
      bottom: 30
    },
    xAxis: {
      type: 'category',
      data: timeList,
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      name: 'mm',
      axisLabel: {
        formatter: '{value}'
      }
    },
    series: [
      {
        name: '厚度 A',
        type: 'line',
        smooth: true,
        data: thicknessA
      },
      {
        name: '厚度 B',
        type: 'line',
        smooth: true,
        data: thicknessB
      },
      {
        name: '厚度 C',
        type: 'line',
        smooth: true,
        data: thicknessC
      }
    ]
  }

  chartInstance.setOption(option)
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', resizeChart)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeChart)
  chartInstance?.dispose()
})

const resizeChart = () => {
  chartInstance?.resize()
}

/**
 * ===== 对外暴露：时间联动 =====
 * 供 父组件 / 设备时间轴 / 视频帧 调用
 */
const highlightByTime = (time) => {
  const index = timeList.indexOf(time)
  if (index === -1 || !chartInstance) return

  chartInstance.dispatchAction({
    type: 'showTip',
    seriesIndex: 0,
    dataIndex: index
  })
}

defineExpose({
  highlightByTime
})
</script>

<style scoped>
.card {
  width: 100%;
  height: 100%; /* 让卡片充满父容器 */
}

.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.title {
  height: 40px;
  line-height: 40px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #ebeef5;
  background: #f5f7fa;
}

.unit {
  font-size: 12px;
  color: #999;
}

.chart {
  width: 100%;
  height: 100%; /* 让图表充满整个卡片 */
  min-height: 250px; /* 设置最小高度确保图表可见 */
}
</style>
